import { https } from 'firebase-functions'
import { gerarXML } from '../transmitir/gerarXml'
import { autorizar } from './autorizacao'
import validarAutenticacao from '../commom/validarAutenticacao'
import validarPermissao from '../commom/validarPermissao'
import carregarEmpresa from '../commom/carregarEmpresa'
import { IReqTransmitir, IResTransmitir } from '../commom/tipos'
import { getInfos } from '../transmitir/getInfos'
import { salvar } from '../transmitir/salvar'
import { erroDesistencia } from '../transmitir/erroDesistencia'

export default async function (
  req: IReqTransmitir,
  context: https.CallableContext
): Promise<IResTransmitir> {
  validarRequisicao(req)
  validarAutenticacao(context)
  const infNFe = req.infNFe
  const CNPJ = infNFe.emit.CNPJ.$t
  validarPermissao(context.auth!.token, CNPJ)
  const { certificado, colunaNFes: coluna } = await carregarEmpresa(CNPJ)
  const infos = await getInfos(coluna, infNFe)
  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const numero = infos.numero + tentativa
    const xml = gerarXML(infNFe, certificado, numero)
    const protNFe = await autorizar(infos, certificado, xml)
    if (protNFe) return await salvar(coluna, infNFe, xml, protNFe, req.oldId)
  }
  throw erroDesistencia
}

function validarRequisicao(req: IReqTransmitir) {
  if (!req.infNFe) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo informações da nota ausente.'
    );
  }
}
