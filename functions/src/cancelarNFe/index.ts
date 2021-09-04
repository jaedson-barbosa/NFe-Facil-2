import { toXml } from 'xml2json'
import { criarXML } from './criarXML'
import { recepcaoEvento } from './recepcaoEvento'
import { https } from 'firebase-functions'
import validarAutenticacao from '../commom/validarAutenticacao'
import validarPermissao from '../commom/validarPermissao'
import carregarEmpresa from '../commom/carregarEmpresa'

export default async function (
  req: IReqCancelar,
  context: https.CallableContext
): Promise<IResCancelar> {
  validarAutenticacao(context)
  validarRequisicao(req)
  const token = context.auth!.token
  const CNPJ = req.idNota.substr(9, 14)
  validarPermissao(token, CNPJ)
  const { certificado, refEmpresa } = await carregarEmpresa(CNPJ)
  const coluna = refEmpresa.collection(Dados.NFes)
  const nota = await carregarNota(coluna, req.idNota)
  const ambiente: TAmb = nota.infNFe.ide.tpAmb
  const xml = criarXML(nota, CNPJ, ambiente, req, certificado)
  const UF: string = nota.infNFe.emit.enderEmit.UF
  const resp = await recepcaoEvento(UF, certificado, ambiente, xml)
  const xmlCancelamento =
    '<procEventoNFe versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
    xml +
    toXml({ retEvento: resp.retEvento }) +
    '</procEventoNFe>'
  const atualizacao = { cancelada: true, xmlCancelamento }
  await coluna.doc(req.idNota).update(atualizacao)
  return { cancelada: true }
}

function validarRequisicao(req: IReqCancelar) {
  if (!req.justificativa) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo "justificativa" (justificativa do cancelamento) ausente.'
    )
  }
  if (!req.dhEvento) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo "dhEvento" (data e hora do evento) ausente.'
    )
  }
  if (!req.idNota) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo "idNota" (identificação da nota fiscal) ausente.'
    )
  }
}

async function carregarNota(
  coluna: FirebaseFirestore.CollectionReference,
  idNota: string
) {
  const nota = await coluna.doc(idNota).get()
  if (!nota.exists) {
    const motivo = 'Nota fiscal não encontrada.'
    throw new https.HttpsError('not-found', motivo)
  }
  return nota.data() as INotaDB
}
