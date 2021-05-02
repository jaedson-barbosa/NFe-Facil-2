import { IEmpresaGet, onLoggedRequest } from './core'
import { IBGESimplificado } from './IBGESimplificado.json'
import * as dateformat from 'dateformat'
import { toJson, toXml } from 'xml2json'
import { INotaDB } from './types'
import { TAmb, enviarRequisicao, getRandomNumber } from './requisicoes'
import { assinarNFe } from './assinaturas'

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
    (p, v) => {
      const name = v[0]
      p[name] =
        typeof v[1] == 'object'
          ? addPrefix(v[1])
          : name == 'nItem' || name == 'dia' //xs:attribute
          ? v[1]
          : { $t: v[1] }
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

function getDhEmi(infNFe: any) {
  return new Date(infNFe.ide.dhEmi)
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
      const dhEmi = getDhEmi(infNFe)
      const xml = getXml(infNFe, '999999999')
      const nota: INotaDB<Date> = {
        json: infNFe,
        xml,
        emitido: false,
        lastUpdate: new Date(),
        view: {
          serie: infNFe.ide.serie,
          nNF: infNFe.ide.nNF,
          dhEmi,
          xNome: infNFe.dest.xNome,
        },
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
      const ambiente: TAmb = TAmb.Homologacao //infNFe.ide.tpAmb
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
      const dhEmi = getDhEmi(infNFe)
      let nfeProc: string | undefined = undefined
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
        if (cStat == '539') {
          // Rejeição: Duplicidade de NF-e com diferença na Chave de Acesso (148)
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
      } while (!nfeProc)
      const nota: INotaDB<Date> = {
        json: infNFe,
        xml: nfeProc,
        emitido: true,
        lastUpdate: new Date(),
        view: {
          serie: infNFe.ide.serie,
          nNF: infNFe.ide.nNF,
          dhEmi,
          xNome: infNFe.dest.xNome,
        },
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
    
    res.status(200).send({
      chave: data.json.Id,
      xml: data.xml,
    })
  }
)
