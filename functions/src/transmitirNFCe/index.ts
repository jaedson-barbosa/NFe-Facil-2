import { https } from 'firebase-functions'
import { gerarXML } from '../transmitir/gerarXml'
import { autorizar } from './autorizacao'
import sha1 from 'js-sha1'
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
  const { CSC, IDCSC } = await getCSC(refEmpresa)
  const infNFeSupl = getInfSupl(infos.UF, infNFe.Id, infos.ambiente, IDCSC, CSC)
  for (let i = 0; i < 5; i++, infos.numero++) {
    const xml = gerarXML(infNFe, certificado, infos.numero, infNFeSupl)
    const protNFe = await autorizar(infos, certificado, xml)
    if (protNFe) {
      const res = await salvar(colunaNFes, infNFe, xml, protNFe, req.oldId)
      return res
    }
  }
  throw erroDesistencia
}

function validarRequisicao(req: IReqTransmitir) {
  if (!req.infNFe) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo informações da nota ausente.'
    )
  }
}

async function getCSC(refEmpresa: FirebaseFirestore.DocumentReference) {
  const docEmpresa = await refEmpresa.get()
  const CSC = docEmpresa.get('CSC')
  const IDCSC = docEmpresa.get('IDCSC')
  if (!CSC || !IDCSC) {
    throw new https.HttpsError(
      'failed-precondition',
      'CSC não está cadastrado.'
    )
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
  const qrCode = `${enderecos.urlQRCode}?p=${paramsUriQR}|${hashUriQR}`
  const urlChave = enderecos.urlChave
  return { qrCode, urlChave }
}
