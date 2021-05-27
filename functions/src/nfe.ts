import { db, IEmpresaGet, onLoggedRequest } from './core'
import { toJson, toXml } from 'xml2json'
import { INotaDB } from './types'
import { TAmb, enviarRequisicao, getRandomNumber } from './requisicoes'
import { assinarNFe } from './assinaturas'
import axios from 'axios'

function calcularDV(chave: string) {
  let soma = 0 // Vai guardar a Soma
  let peso = 2 // vai guardar o peso de multiplicacao
  //percorrendo cada caracter da chave da direita para esquerda para fazer os calculos com o peso
  for (let i = chave.length - 1; i >= 0; i--, peso++) {
    if (peso == 10) peso = 2
    let atual = Number(chave[i])
    soma += atual * peso
  }
  //Agora que tenho a soma vamos pegar o resto da divisão por 11
  let resto = soma % 11
  //Aqui temos uma regrinha, se o resto da divisão for 0 ou 1 então o dv vai ser 0
  return resto == 0 || resto == 1 ? 0 : 11 - resto
}

function getXml(infNFe: any, numero: string) {
  infNFe.ide.nNF.$t = numero
  const oldChave = infNFe.Id.substr(3,43)
  const novaChave = oldChave.substr(0,25)+numero.padStart(9, '0')+oldChave.substr(34)
  const cDV = calcularDV(novaChave).toString()
  infNFe.ide.cDV.$t = cDV
  infNFe.Id = `NFe${novaChave}${cDV}`
  const NFe = { xmlns: 'http://www.portalfiscal.inf.br/nfe', infNFe }
  return toXml({ NFe })
}

interface TRetEnviNFe {
  versao: string
  tpAmb: string
  verAplic: string
  cStat: string
  xMotivo: string
  cUF: string
  dhRecbto: string
  infRec: {
    nRec: string
    tMed: string
  }
}

async function autorizacao(
  empresa: IEmpresaGet,
  publicCert: string,
  privateCert: string,
  ambiente: TAmb,
  ...xmls: string[]
): Promise<TRetEnviNFe> {
  const respAutorizacao = await enviarRequisicao(
    `<enviNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
      <idLote>${getRandomNumber(1, 999999999999999)}</idLote>
      <indSinc>0</indSinc>
      ${xmls.join('')}
    </enviNFe>`,
    'autorizacao',
    ambiente,
    empresa,
    publicCert,
    privateCert
  )
  const retEnviNFe = (toJson(respAutorizacao, {
    object: true,
  }) as any)['soap:Envelope']['soap:Body'].nfeResultMsg.retEnviNFe
  return retEnviNFe as TRetEnviNFe
}

interface TRetConsReciNFe {
  versao: string
  tpAmb: { $t: string }
  verAplic: { $t: string }
  nRec: { $t: string }
  cStat: { $t: string }
  xMotivo: { $t: string }
  cUF: { $t: string }
  dhRecbto: { $t: string }
  cMsg: { $t: string }
  xMsg: { $t: string }
  protNFe: any
}

async function retAutorizacao(
  empresa: IEmpresaGet,
  publicCert: string,
  privateCert: string,
  ambiente: TAmb,
  nRec: string
): Promise<TRetConsReciNFe> {
  const respRetAutorizacao = await enviarRequisicao(
    `<consReciNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
      <tpAmb>${ambiente}</tpAmb>
      <nRec>${nRec}</nRec>
    </consReciNFe>`,
    'retAutorizacao',
    ambiente,
    empresa,
    publicCert,
    privateCert
  )
  const retConsReciNFe = (toJson(respRetAutorizacao, {
    object: true,
    reversible: true,
  }) as any)['soap:Envelope']['soap:Body'].nfeResultMsg.retConsReciNFe
  return retConsReciNFe as TRetConsReciNFe
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function removePrefix(obj: any) {
  if (typeof obj != 'object') return obj
  const e = Object.entries(obj)
  if (!e[0]) return obj
  if (e[0][0] == '$t') return e[0][1]
  e.forEach(([v0, v1]) => (obj[v0] = removePrefix(v1)))
  return obj
}

export const transmitirNFe = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    const dataCertComplete = await db.collection('certificados').doc(empresaRef.id).get()
    if (!dataCertComplete.exists) {
      res.status(400).send('Não existe certificado para este CNPJ')
      return
    }
    const dataCert = dataCertComplete.data()!
    const infNFe = body.infNFe
    if (!infNFe) {
      res.status(400).send('Requisição sem corpo da nota')
      return
    }
    const oldId = infNFe.Id
    try {
      let serie = infNFe.ide.serie.$t
      const ambiente: TAmb = +infNFe.ide.tpAmb.$t
      if (ambiente == TAmb.Homologacao) {
        infNFe.dest.xNome.$t = 'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
      } else {
        res.status(400).send("Emissão em produção ainda não está liberada")
        return
      }
      const notasSalvasCol = empresaRef.collection('notasSalvas')
      const notasEmitidasCol = empresaRef.collection('notasEmitidas')
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
        const resp = await autorizacao(empresa, dataCert.publiCert, dataCert.privateCert, ambiente, signedXml)
        if (resp.cStat != '103') {
          res.status(400).send('Falha ao tentar enviar lote: ' + resp.xMotivo)
          return
        }
        let respRet: TRetConsReciNFe | undefined = undefined
        do {
          await sleep(Number(resp.infRec.tMed) * 1000)
          respRet = await retAutorizacao(empresa, dataCert.publiCert, dataCert.privateCert, ambiente, resp.infRec.nRec)
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
      await notasEmitidasCol.doc(infNFe.Id).set({
        cancelada: false,
        infNFe: removePrefix(infNFe),
        dhEmi: new Date(infNFe.ide.dhEmi.$t),
        nProt,
        xml: nfeProc
      })
      res.status(201).send(infNFe.Id)
    } catch (error) {
      res.status(500).send(typeof error == 'object' ? JSON.stringify(error) : error)
    }
  }
)

/**
 * Sucesso em todas as situações: produção, homologação e apenas salva
 * Será usada a cloud pra ser uma preocupação a menos e pra analisar custos
 */
export const gerarDANFE = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    const idNota = body.idNota
    if (!idNota) {
      res.status(400).send('Requisição sem id da nota.')
      return
    }
    const nota = await empresaRef.collection('notas').doc(idNota).get()
    if (!nota.exists) {
      res.status(400).send('Nota não existe')
      return
    }
    const data = nota.data() as INotaDB<FirebaseFirestore.Timestamp>
    const urlCloud =
      'https://us-central1-nfe-facil-980bc.cloudfunctions.net/helloWorld'
    const parametros = {
      xml: data.xml.replace(/>\s+</g, '><'),
      orientacao: 'P',
      margSup: 5,
      margEsq: 5,
    }
    const danfe = await axios.post(urlCloud, parametros, {
      responseType: 'arraybuffer', // Repassa as informações sem corrompê-las
    })
    res.send(danfe.data)
  }
)
/*
export const cancelarNFe = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
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
    const nota = await empresaRef.collection('notas').doc(idNota).get()
    if (!nota.exists) {
      res.status(400).send('Nota não existe')
      return
    }
    const data = nota.data() as INotaDB<FirebaseFirestore.Timestamp>
    const cOrgao = data.json.ide.cUF
    const chaveNFe = data.json.Id?.slice(3)
    const numeroProtocolo = data.nProt
    const ambiente = data.json.ide.tpAmb as TAmb
    const signedXml = criarXMLEventoCancelamento(
      empresa,
      cOrgao,
      chaveNFe,
      numeroProtocolo,
      justificativa,
      dhEvento,
      ambiente
    )
    const resp = await recepcaoEvento(empresa, ambiente, signedXml)
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
    const refNota = empresaRef.collection('notas').doc(idNota)
    await refNota.update({ lastUpdate: new Date(), eventos: FieldValue.arrayUnion('Cancelamento') })
    await refNota
      .collection('eventos')
      .doc('Cancelamento')
      .set({ xml: procEventoNFe })
    res.sendStatus(201)
  }
)

interface retEnvEvento {
  versao: string
  idLote: { $t: string }
  tpAmb: { $t: string }
  verAplic: { $t: string }
  cOrgao: { $t: string }
  cStat: { $t: string }
  xMotivo: { $t: string }
  retEvento: {
    infEvento: {
      cStat: { $t: string }
      xMotivo: { $t: string }
    }
  }
}

function criarXMLEventoCancelamento(
  empresa: IEmpresaGet,
  cOrgao: number,
  chaveNFe: string,
  numeroProtocolo: number,
  justificativa: string,
  dhEvento: string,
  ambiente: TAmb
) {
  const xml = `<evento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
  <infEvento Id="ID110111${chaveNFe}01">
    <cOrgao>${cOrgao}</cOrgao>
    <tpAmb>${ambiente}</tpAmb>
    <CNPJ>${empresa.emit.CNPJ}</CNPJ>
    <chNFe>${chaveNFe}</chNFe>
    <dhEvento>${dhEvento}</dhEvento>
    <tpEvento>110111</tpEvento>
    <nSeqEvento>1</nSeqEvento>
    <verEvento>1.00</verEvento>
    <detEvento versao="1.00">
      <descEvento>Cancelamento</descEvento>
      <nProt>${numeroProtocolo}</nProt>
      <xJust>${justificativa}</xJust>
    </detEvento>
  </infEvento>
  </evento>`.replace(/>\s+</g, '><')
  const signedXml = assinarEvento(empresa, xml)
  return signedXml
}

async function recepcaoEvento(
  empresa: IEmpresaGet,
  ambiente: TAmb,
  xml: string
): Promise<retEnvEvento> {
  const envio = `<envEvento versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">
    <idLote>${getRandomNumber(1, 999999999999999)}</idLote>
    ${xml}
  </envEvento>`
  const respRecepcaoEvento = await enviarRequisicao(
    envio,
    'recepcaoEvento',
    ambiente,
    empresa
  )
  const retEnvEvento = (toJson(respRecepcaoEvento, {
    object: true,
    reversible: true,
  }) as any)['soap:Envelope']['soap:Body'].nfeResultMsg.retEnvEvento
  return retEnvEvento as retEnvEvento
}*/
