import { FieldValue, IEmpresaGet, onLoggedRequest } from './core'
import { IBGESimplificado } from './IBGESimplificado.json'
import * as dateformat from 'dateformat'
import { toJson, toXml } from 'xml2json'
import { INotaDB } from './types'
import { TAmb, enviarRequisicao, getRandomNumber } from './requisicoes'
import { assinarEvento, assinarNFe } from './assinaturas'
import axios from 'axios'
import { IViewNota } from '../../commom'

// const ambiente = ambientes.Homologacao

export const getJsonNota = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    const idNota = body.idNota
    if (!idNota) {
      res.status(400).send('Id de nota inválido')
      return
    }
    const nota = await empresaRef.collection('notas').doc(idNota).get()
    if (!nota.exists) {
      res.status(400).send('Nota não existe')
      return
    }
    const data = nota.data() as INotaDB<FirebaseFirestore.Timestamp>
    res.status(200).send({ infNFe: data.json })
  }
)

function addPrefix(obj: any) {
  return Object.entries(obj).reduce(
    (p, [v0, v1]) => {
      const name = v0
      p[name] =
        typeof v1 == 'object'
          ? addPrefix(v1)
          : name == 'nItem' || name == 'dia' //xs:attribute
          ? v1
          : { $t: v1 }
      return p
    },
    Array.isArray(obj) ? [] : ({} as any)
  )
}

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
  infNFe.ide.nNF = numero
  // Calculo da chave
  const cUF = IBGESimplificado.find(
    (v) => v.Sigla == (infNFe.emit.enderEmit.UF as string)
  )!.Codigo
  const AAMM = dateformat(infNFe.ide.dhEmi, 'yymm')
  const CNPJ = infNFe.emit.CNPJ
  const mod = infNFe.ide.mod
  const serie = (infNFe.ide.serie as string).padStart(3, '0')
  const nNF = (infNFe.ide.nNF as string).padStart(9, '0')
  const tpEmis = infNFe.ide.tpEmis
  const cNF = infNFe.ide.cNF
  const chave = `${cUF}${AAMM}${CNPJ}${mod}${serie}${nNF}${tpEmis}${cNF}`
  const cDV = calcularDV(chave).toString()
  infNFe.ide.cDV = cDV
  const prefixedInfNFe = addPrefix(infNFe)
  prefixedInfNFe.versao = infNFe.versao = '4.00'
  prefixedInfNFe.Id = infNFe.Id = `NFe${chave}${cDV}`
  const xml = toXml({
    NFe: {
      xmlns: 'http://www.portalfiscal.inf.br/nfe',
      infNFe: prefixedInfNFe,
    },
  })
  return xml
}

export const apenasSalvarNota = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    // Inserir analise pra quando a nota ja foi emitida
    const idNota = body.idNota
    const infNFe = body.infNFe
    if (!infNFe) {
      res.status(400).send('Requisição sem corpo da nota')
      return
    }
    try {
      const xml = getXml(infNFe, '999999999')
      const nota: INotaDB<Date> = {
        json: infNFe,
        xml,
        emitido: false,
        lastUpdate: new Date(),
        nProt: 0,
        eventos: [],
      }
      await (idNota
        ? empresaRef.collection('notas').doc(idNota)
        : empresaRef.collection('notas').doc()
      ).set(nota)
      res.sendStatus(201)
    } catch (error) {
      res.status(500).send(JSON.stringify(error))
    }
  }
)

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
    empresa
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
    empresa
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

export const assinarTransmitirNota = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    const idNota = body.idNota
    const infNFe = body.infNFe
    if (!infNFe) {
      res.status(400).send('Requisição sem corpo da nota')
      return
    }
    try {
      let serie = infNFe.ide.serie
      const ambiente: TAmb = infNFe.ide.tpAmb
      if (ambiente == TAmb.Homologacao) {
        const homologDest =
          'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
        infNFe.dest.xNome = homologDest
      }
      // Calculo do numero
      const maxNota = await empresaRef
        .collection('notas')
        .where('emitido', '==', true)
        .where('json.ide.serie', '==', serie)
        .where('json.ide.tpAmb', '==', ambiente)
        .orderBy('json.ide.nNF')
        .select('json.ide.nNF')
        .limit(1)
        .get()
      let nfeProc: string | undefined = undefined
      let nProt: number = 0
      let numero: number = maxNota.empty
        ? 1
        : maxNota.docs[0].data().json.ide.nNF + 1
      do {
        const xml = getXml(infNFe, numero.toString())
        const signedXml = assinarNFe(empresa, xml)
        const resp = await autorizacao(empresa, ambiente, signedXml)
        if (resp.cStat != '103') {
          res.status(400).send('Falha ao tentar enviar lote: ' + resp.xMotivo)
          return
        }
        let respRet: TRetConsReciNFe | undefined = undefined
        do {
          await sleep(Number(resp.infRec.tMed) * 1000)
          respRet = await retAutorizacao(empresa, ambiente, resp.infRec.nRec)
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
      const nota: INotaDB<Date> = {
        json: infNFe,
        xml: nfeProc,
        emitido: true,
        lastUpdate: new Date(),
        nProt,
        eventos: [],
      }
      await (idNota
        ? empresaRef.collection('notas').doc(idNota)
        : empresaRef.collection('notas').doc()
      ).set(nota)
      res.sendStatus(201)
    } catch (error) {
      res.status(500).send(JSON.stringify(error))
    }
  }
)

export const getXML = onLoggedRequest(
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
    res.status(200).send({
      chave: data.json.Id,
      xml: data.xml,
    })
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

export function getViewNota(
  nota: INotaDB<Date | FirebaseFirestore.Timestamp>,
  emitido: boolean
): IViewNota<Date> {
  const json = nota.json
  return {
    serie: json.ide.serie,
    nNF: json.ide.nNF,
    dhEmi: new Date(json.ide.dhEmi),
    xNome: json.dest.xNome,
    Id: emitido ? json.Id?.slice(3) : '',
    eventos: nota.eventos ?? [],
  }
}

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
}
