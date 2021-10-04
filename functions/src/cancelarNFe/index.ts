import { toXml } from 'xml2json'
import { recepcaoEvento, retEnvEvento } from './recepcaoEvento'
import { https } from 'firebase-functions'
import validarAutenticacao from '../commom/validarAutenticacao'
import validarPermissao from '../commom/validarPermissao'
import carregarEmpresa from '../commom/carregarEmpresa'
import gerarXML from './gerarXML'
import {
  Ambientes,
  INotaDB,
  IReqCancelar,
  IResCancelar,
} from '../commom/tipos'

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
  const coluna = refEmpresa.collection('nfes')
  const nota = await carregarNota(coluna, req.idNota)
  const ambiente: Ambientes = nota.infNFe.ide.tpAmb
  const xml = gerarXML(nota, CNPJ, ambiente, req, certificado)
  const UF: string = nota.infNFe.emit.enderEmit.UF
  const resp = await recepcaoEvento(UF, certificado, ambiente, xml)
  await registrarCancelamento(coluna, xml, req.idNota, resp)
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

async function registrarCancelamento(
  coluna: FirebaseFirestore.CollectionReference,
  xml: string,
  idNota: string,
  evento: retEnvEvento
) {
  const xmlCancelamento =
    '<procEventoNFe versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
    xml +
    toXml({ retEvento: evento.retEvento }) +
    '</procEventoNFe>'
  const atualizacao = { cancelada: true, xmlCancelamento }
  await coluna.doc(idNota).update(atualizacao)
}
