import { toXml } from 'xml2json'
import { onCertifiedRequest } from '../onCertifiedRequest'
import { TAmb } from '../TAmb'
import { INotaDB } from '../INotaDB'
import { criarXML } from './criarXML'
import { recepcaoEvento } from './recepcaoEvento'
import { assinarEvento } from '../assinatura/assinarEvento'
import { https } from 'firebase-functions'

export const cancelarNFe = onCertifiedRequest(
  async ({ body, UF, empRef, cert }) => {
    const idNota = body.idNota
    const justificativa = body.justificativa?.trim()
    const dhEvento = body.dhEvento
    if (!justificativa) {
      throw new https.HttpsError(
        'failed-precondition',
        'Campo "justificativa" (justificativa do cancelamento) ausente.'
      )
    }
    if (!dhEvento) {
      throw new https.HttpsError(
        'failed-precondition',
        'Campo "dhEvento" (data e hora do evento) ausente.'
      )
    }
    if (!idNota) {
      throw new https.HttpsError(
        'failed-precondition',
        'Campo "idNota" (identificação da nota fiscal) ausente.'
      )
    }
    const nota = await empRef.collection('notasEmitidas').doc(idNota).get()
    if (!nota.exists) {
      throw new https.HttpsError(
        'not-found',
        'Nota fiscal não encontrada.'
      )
    }
    const data = nota.data() as INotaDB
    const cOrgao = data.infNFe.ide.cUF
    const chaveNFe = data.infNFe.Id?.slice(3)
    const numeroProtocolo = data.nProt!
    const ambiente = +data.infNFe.ide.tpAmb as TAmb
    const xml = criarXML(
      empRef.id,
      cOrgao,
      chaveNFe,
      numeroProtocolo,
      justificativa,
      dhEvento,
      ambiente
    )
    const signedXml = assinarEvento(cert, xml)
    const resp = await recepcaoEvento(UF, cert, ambiente, signedXml)
    if (resp.cStat.$t != '128') {
      throw new https.HttpsError(
        'internal',
        'Evento recusado.',
        resp.xMotivo.$t
      )
    }
    const cStat = resp.retEvento.infEvento.cStat.$t
    if (cStat != '135' && cStat != '155') {
      throw new https.HttpsError(
        'invalid-argument',
        'Cancelamento recusado.',
        resp.retEvento.infEvento.xMotivo.$t
      )
    }
    const procEventoNFe =
      '<procEventoNFe versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
      signedXml +
      toXml({ retEvento: resp.retEvento }) +
      '</procEventoNFe>'
    await empRef.collection('notasEmitidas').doc(idNota).update({
      cancelada: true,
      xmlCancelamento: procEventoNFe,
    })
    return true
  }, true
)
