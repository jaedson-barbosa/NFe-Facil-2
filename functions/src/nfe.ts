import { onLoggedRequest } from './core'
// import { ambientes, autorizacao } from './requisicoes'
import { IBGESimplificado } from './IBGESimplificado.json'
import * as dateformat from 'dateformat'
import { toXml } from 'xml2json'
import { INotaDB } from './types'
import { ambientes } from './requisicoes'

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

export const apenasSalvarNota = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    // Inserir analise pra quando a nota ja foi emitida
    const idNota = body.idNota
    const infNFe = body.infNFe
    if (!infNFe) {
      res.status(400).send('Requisição sem corpo da nota.')
      return
    }
    try {
      infNFe.ide.nNF = '999999999'
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
      const dhEmi = new Date(infNFe.ide.dhEmi)
      const prefixedInfNFe = addPrefix(infNFe)
      prefixedInfNFe.versao = infNFe.versao = '4.00'
      prefixedInfNFe.Id = infNFe.Id = `NFe${chave}${cDV}`
      const nota: INotaDB<Date> = {
        json: infNFe,
        xml: toXml({ NFe: { infNFe: prefixedInfNFe } }),
        emitido: false,
        lastUpdate: dhEmi,
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

export const assinarTransmitirNota = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    let serie = 1
    let tpAmb = 2
    if (!body.idNota && !body.infNFe) {
      res.status(400).send('Requisição sem nenhuma referência de nota')
      return
    }
    if (body.idNota && body.infNFe) {
      res.status(400).send('Requisição com duas referências simultâneas.')
      return
    }
    let infNFe: any
    if (body.idNota) {
      const nota = await empresaRef.collection('notas').doc(body.idNota).get()
      if (!nota.exists) {
        res.status(400).send('Nota não existe')
        return
      }
      const data = nota.data() as INotaDB<FirebaseFirestore.Timestamp>
      infNFe = data.json
    } else {
      infNFe = body.infNFe
    }
    infNFe.ide.tpAmb = ambientes.Homologacao

    // Calculo do numero
    const maxNota = await empresaRef
      .collection('notas')
      .where('json.ide.serie', '==', serie)
      .where('json.ide.tpAmb', '==', tpAmb)
      .orderBy('json.ide.nNF')
      .select('json.ide.nNF')
      .limit(1)
      .get()
    infNFe.ide.nNF = maxNota.empty ? 1 : maxNota.docs[0].data().json.ide.nNF + 1
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
