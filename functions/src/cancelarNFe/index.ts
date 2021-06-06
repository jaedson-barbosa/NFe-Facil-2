import { toXml } from 'xml2json'
import { onCertifiedRequest } from '../onCertifiedRequest'
import { TAmb } from '../TAmb'
import { INotaDB } from '../INotaDB'
import { criarXML } from './criarXML'
import { recepcaoEvento } from './recepcaoEvento'
import { assinarEvento } from '../assinatura/assinarEvento'

export const cancelarNFe = onCertifiedRequest(
  async ({ body, UF, empRef, cert }, res) => {
    const idNota = body.idNota
    const justificativa = body.justificativa?.trim()
    const dhEvento = body.dhEvento
    if (!justificativa) {
      res.status(400).send('É necessário informar o motivo do cancelamento')
      return
    }
    if (!dhEvento) {
      res.status(400).send('Requisição sem informação da data e hora do evento')
      return
    }
    if (!idNota) {
      res.status(400).send('Requisição sem id da nota')
      return
    }
    const nota = await empRef.collection('notasEmitidas').doc(idNota).get()
    if (!nota.exists) {
      res.status(400).send('Nota não existe')
      return
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
      res.status(400).send(resp.xMotivo.$t)
      return
    }
    const cStat = resp.retEvento.infEvento.cStat.$t
    if (cStat != '135' && cStat != '155') {
      res.status(400).send(resp.retEvento.infEvento.xMotivo.$t)
      return
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
    res.sendStatus(200)
  }
)
