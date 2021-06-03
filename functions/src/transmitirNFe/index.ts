import { onLoggedRequest } from '../onLoggedRequest'
import { toXml } from 'xml2json'
import { TAmb } from '../TAmb'
import { getXml } from './getXml'
import { TRetConsReciNFe } from './TRetConsReciNFe'
import { autorizacao } from './autorizacao'
import { retAutorizacao } from './retAutorizacao'
import { removePrefix } from './removePrefix'
import { sleep } from './sleep'
import { getCert } from '../assinatura/getCert'
import { assinarNFe } from '../assinatura/assinarNFe'

export const transmitirNFe = onLoggedRequest(
  async ({ body, empRef, empData }, res) => {
    const infNFe = body.infNFe
    if (!infNFe) {
      res.status(400).send('Requisição sem corpo da nota')
      return
    }
    const dataCert = await getCert(empRef.id)
    if (!dataCert) {
      res.status(400).send('Certificado não encontrado.')
      return
    }
    const oldId = infNFe.Id
    try {
      let serie = infNFe.ide.serie.$t
      const ambiente: TAmb = +infNFe.ide.tpAmb.$t
      if (ambiente == TAmb.Homologacao) {
        infNFe.dest.xNome.$t =
          'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
      } else {
        res.status(400).send('Emissão em produção ainda não está liberada')
        return
      }
      const notasSalvasCol = empRef.collection('notasSalvas')
      const notasEmitidasCol = empRef.collection('notasEmitidas')
      // Calculo do numero
      const maxNota = await notasEmitidasCol
        .where('infNFe.ide.serie', '==', serie)
        .where('infNFe.ide.tpAmb', '==', ambiente.toString())
        .orderBy('infNFe.ide.nNF')
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
        const signedXml = await assinarNFe(dataCert, xml)
        const resp = await autorizacao(empData, dataCert, ambiente, signedXml)
        if (resp.cStat != '103') {
          res.status(400).send('Falha ao tentar enviar lote: ' + resp.xMotivo)
          return
        }
        let respRet: TRetConsReciNFe | undefined = undefined
        do {
          await sleep(Number(resp.infRec.tMed) * 1000)
          respRet = await retAutorizacao(
            empData,
            dataCert,
            ambiente,
            resp.infRec.nRec
          )
          if (respRet.cStat.$t == '105') {
            // Lote em processamento (78)
            respRet = undefined
          }
        } while (!respRet)
        if (respRet.cStat.$t != '104') {
          res.status(400).send('Falha no lote: ' + respRet.xMotivo.$t)
          return
        }
        const cStat = respRet.protNFe.infProt.cStat.$t
        if (cStat == '539' || cStat == '206') {
          // Rejeição: Duplicidade de NF-e com diferença na Chave de Acesso (148)
          // Rejeição: NF-e já está inutilizada na Base de Dados da SEFAZ
          numero += 1
          continue
        }
        if (cStat != '100') {
          res
            .status(400)
            .send('Falha na NFe: ' + respRet.protNFe.infProt.xMotivo.$t)
          return
        }
        nfeProc =
          '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
          signedXml +
          toXml({ protNFe: respRet.protNFe }) +
          '</nfeProc>'
        nProt = Number(respRet.protNFe.infProt.nProt.$t)
      } while (!nfeProc)
      const oldDocRef = notasSalvasCol.doc(oldId)
      const oldDoc = await oldDocRef.get()
      if (oldDoc.exists) {
        if (oldDoc.get('status') == 0) {
          await oldDocRef.delete()
        } else {
          res.status(400).send('Proibido: nota fiscal já emitida ou cancelada.')
          return
        }
      }
      const dhEmi = new Date(infNFe.ide.dhEmi.$t)
      await notasEmitidasCol.doc(infNFe.Id).set({
        cancelada: false,
        infNFe: removePrefix(infNFe),
        dhEmi,
        nProt,
        xml: nfeProc,
      })
      res.status(201).send(infNFe.Id)
    } catch (error) {
      res
        .status(500)
        .send(typeof error == 'object' ? JSON.stringify(error) : error)
    }
  }
)
