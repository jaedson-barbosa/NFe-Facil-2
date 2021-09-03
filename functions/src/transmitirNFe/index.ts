import { onCertifiedRequest } from '../onCertifiedRequest'
import { toXml } from 'xml2json'
import { getXml } from './getXml'
import { autorizacao } from './autorizacao'
import { retAutorizacao } from './retAutorizacao'
import { removePrefix } from './removePrefix'
import { assinarNFe } from '../assinatura/assinarNFe'
import { https } from 'firebase-functions'

export const transmitirNFe = onCertifiedRequest(
  async ({ body, empRef, UF, cert }) => {
    const infNFe = body.infNFe
    if (!infNFe) {
      throw new https.HttpsError(
        'failed-precondition',
        'Campo "infNFe" (informações da nota) ausente.'
      )
    }
    let serie = infNFe.ide.serie.$t
    const ambiente: TAmb = +infNFe.ide.tpAmb.$t
    if (ambiente == TAmb.Homologacao) {
      const k = 'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
      infNFe.dest.xNome.$t = k
    }
    const notasSalvasCol = empRef.collection('notasSalvas')
    const notasEmitidasCol = empRef.collection('notasEmitidas')
    // Calculo do numero
    const maxNota = await notasEmitidasCol
      .where('infNFe.ide.serie', '==', serie)
      .where('infNFe.ide.tpAmb', '==', ambiente.toString())
      .orderBy('infNFe.ide.nNF', 'desc')
      .select('infNFe.ide.nNF')
      .limit(1)
      .get()
    let nfeProc: string | undefined = undefined
    let nProt: number = 0
    let numero: number = maxNota.empty
      ? 1
      : +maxNota.docs[0].get('infNFe.ide.nNF') + 1
    do {
      const xml = getXml(infNFe, numero.toString())
      const signedXml = await assinarNFe(cert, xml)
      const resp = await autorizacao(UF, cert, ambiente, signedXml)
      if (resp.cStat != '103') {
        throw new https.HttpsError(
          'internal',
          'Falha durante envio de lote de notas fiscais.',
          resp.xMotivo
        )
      }
      let respRet: TRetConsReciNFe | undefined = undefined
      do {
        const intervalo = Number(resp.infRec.tMed) * 1000
        await new Promise((resolve) => setTimeout(resolve, intervalo))
        respRet = await retAutorizacao(UF, cert, ambiente, resp.infRec.nRec)
        if (respRet.cStat.$t == '105') {
          // Lote em processamento (78)
          respRet = undefined
        }
      } while (!respRet)
      if (respRet.cStat.$t != '104') {
        throw new https.HttpsError(
          'internal',
          'Falha no lote de notas fiscais.',
          respRet.xMotivo.$t
        )
      }
      const cStat = respRet.protNFe.infProt.cStat.$t
      if (cStat == '539' || cStat == '206') {
        // Rejeição: Duplicidade de NF-e com diferença na Chave de Acesso (148)
        // Rejeição: NF-e já está inutilizada na Base de Dados da SEFAZ
        numero += 1
        continue
      }
      if (cStat != '100') {
        throw new https.HttpsError(
          'invalid-argument',
          'Falha na nota fiscal.',
          respRet.protNFe.infProt.xMotivo.$t
        )
      }
      nfeProc =
        '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
        signedXml +
        toXml({ protNFe: respRet.protNFe }) +
        '</nfeProc>'
      nProt = Number(respRet.protNFe.infProt.nProt.$t)
    } while (!nfeProc)
    if (infNFe.oldId) {
      const oldDocRef = notasSalvasCol.doc(infNFe.oldId)
      const oldDoc = await oldDocRef.get()
      if (oldDoc.exists) await oldDocRef.delete()
    }
    const dhEmi = new Date(infNFe.ide.dhEmi.$t)
    const novoRegistro = {
      cancelada: false,
      infNFe: removePrefix(infNFe),
      dhEmi,
      nProt,
      xml: nfeProc,
    }
    await notasEmitidasCol.doc(infNFe.Id).set(novoRegistro)
    return novoRegistro
  },
  true
)
