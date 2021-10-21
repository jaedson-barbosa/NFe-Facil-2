import { https } from 'firebase-functions'
import { atualizarId, gerarXML } from '../transmitir/gerarXml'
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
  for (let i = 0; i < 10; i++, infos.numero++) {
    atualizarId(infNFe, infos.numero)
    const xml = gerarXML(infNFe, certificado)
    const protNFe = await autorizar(infos, certificado, xml)
    if (protNFe) {
      const res = await salvar(coluna, infNFe, xml, protNFe, req.oldId)
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
