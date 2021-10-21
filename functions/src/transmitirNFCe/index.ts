import { https } from 'firebase-functions'
import { atualizarId, gerarXML } from '../transmitir/gerarXml'
import { autorizar } from './autorizacao'
import sha1 from 'sha1'
import validarAutenticacao from '../commom/validarAutenticacao'
import validarPermissao from '../commom/validarPermissao'
import carregarEmpresa from '../commom/carregarEmpresa'
import { Ambientes, IReqTransmitir, IResTransmitir } from '../commom/tipos'
import { getInfos } from '../transmitir/getInfos'
import { salvar } from '../transmitir/salvar'
import { erroDesistencia } from '../transmitir/erroDesistencia'
import { urlsProducao, urlsHomologacao } from './urls'

export default async function (
  req: IReqTransmitir,
  context: https.CallableContext
): Promise<IResTransmitir> {
  validarRequisicao(req)
  validarAutenticacao(context)
  const infNFe = req.infNFe
  const CNPJ = infNFe.emit.CNPJ.$t
  validarPermissao(context.auth!.token, CNPJ)
  const { certificado, colunaNFes, refEmpresa } = await carregarEmpresa(CNPJ)
  const infos = await getInfos(colunaNFes, infNFe)
  const { ambiente } = infos
  corrigirProduto(infNFe, ambiente)
  const { CSC, IDCSC } = await getCSC(refEmpresa, ambiente)
  // for (let i = 0; i < 10; i++, infos.numero++)
  {
    atualizarId(infNFe, infos.numero)
    const infNFeSupl = getInfSupl(infos.UF, infNFe.Id, ambiente, IDCSC, CSC)
    const xml = gerarXML(infNFe, certificado, infNFeSupl)
    const protNFe = await autorizar(infos, certificado, xml)
    if (protNFe) {
      const res = await salvar(colunaNFes, infNFe, xml, protNFe, req.oldId)
      return res
    }
  }
  throw erroDesistencia
}

function corrigirProduto(infNFe: any, ambiente: Ambientes) {
  if (infNFe.ide.mod.$t === '65' && ambiente == Ambientes.Homologacao) {
    const produtoHomologacao =
      'NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
    infNFe.det[0].prod.xProd.$t = produtoHomologacao
  }
}

function validarRequisicao(req: IReqTransmitir) {
  if (!req.infNFe) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo informações da nota ausente.'
    )
  }
}

async function getCSC(
  refEmpresa: FirebaseFirestore.DocumentReference,
  ambiente: Ambientes
) {
  const docEmpresa = await refEmpresa.get()
  const CSC: string = docEmpresa.get('CSC')
  const IDCSC: string = docEmpresa.get('IDCSC')
  if (!CSC || !IDCSC) {
    throw new https.HttpsError(
      'failed-precondition',
      'CSC de produção não está cadastrado.'
    )
  }
  if (ambiente === Ambientes.Homologacao) {
    const CSCh: string = docEmpresa.get('CSCh')
    const IDCSCh: string = docEmpresa.get('IDCSCh')
    if (CSCh && IDCSCh) return { CSC: CSCh, IDCSC: IDCSCh }
  }
  return { CSC, IDCSC }
}

function getInfSupl(
  uf: string,
  idNFe: string,
  ambiente: Ambientes,
  idCSC: string,
  CSC: string
) {
  const paramsUriQR = [idNFe.substr(3), 2, ambiente, +idCSC].join('|')
  const hashUriQR = sha1(paramsUriQR + CSC).toUpperCase()
  const ehProducao = ambiente == Ambientes.Producao
  const enderecos = ehProducao ? urlsProducao[uf] : urlsHomologacao[uf]
  const qrCode =
    `http${enderecos.https ? 's' : ''}://${enderecos.url}?p=` +
    `${paramsUriQR}|${hashUriQR}`
  const urlChave = enderecos.url
  return { qrCode, urlChave }
}
