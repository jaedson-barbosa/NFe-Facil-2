import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import * as parser from 'xml2json-light-es6module'
import idAleatorio from './idAleatorio'
import { Dados, INotaDB } from './tipos'

export async function processarNotas(
  refEmpresa: DocumentReference,
  arquivos: FileList,
  log: (v: string) => void
) {
  log(`Iniciando análise de ${arquivos.length} arquivos...`)
  const colecao = collection(refEmpresa, Dados.NFes)
  const possuiCadastros = getPossuiCadastros(colecao)
  if (possuiCadastros) {
    log('Detectada presença de cadastros, usando importação lenta.')
  } else {
    log('Primeiro uso, usando importação rápida.')
  }
  let notasAceitas: INotaDB[] = []
  for (let i = 0; i < arquivos.length; i++) {
    const arquivo = arquivos[i]
    const name = arquivo.name
    log(`Analisando arquivo ${name}.`)
    try {
      const xml = await arquivo.text()
      const json = parser.xml2json(xml)
      const nfeProc = json.nfeProc
      const infNFe = nfeProc.NFe.infNFe
      const id = infNFe.Id
      if (!id) {
        log(`Arquivo ${name} rejeitado: sem Id...`)
        continue
      }
      const versao = infNFe.versao
      if (versao != '4.00') {
        log(`Nota ${id} rejeitada: versão ${versao} não é suportada.`)
        continue
      }
      const nfeRef = doc(colecao, id)
      if (possuiCadastros) {
        const salva = await getDoc(nfeRef)
        if (salva.exists()) {
          log(`Nota ${id} rejeitada: já está registrada.`)
          continue
        }
      }
      const dhEmi = new Date(infNFe.ide.dhEmi)
      const nProt = nfeProc.protNFe.infProt.nProt
      const nfeData: INotaDB = {
        infNFe,
        dhEmi: Timestamp.fromDate(dhEmi),
        cancelada: false,
        nProt,
        xml,
      }
      await setDoc(nfeRef, nfeData)
      notasAceitas.push(nfeData)
      log(`Nota ${id} aceita e registrada no banco de dados.`)
    } catch (error) {
      log(`Arquivo ${name} rejeitado: ${error.message}`)
    }
  }
  log(`${notasAceitas.length} notas foram aceitas.`)
  return notasAceitas.sort((a, b) => (a.dhEmi > b.dhEmi ? -1 : 1))
}

export async function processarClientes(
  refEmpresa: DocumentReference,
  notas: INotaDB[],
  log: (v: string) => void
) {
  log(`Iniciando busca de clientes em ${notas.length} notas...`)
  const colecao = collection(refEmpresa, Dados.Clientes)
  const possuiCadastros = getPossuiCadastros(colecao)
  const clientes = notas
    .filter((v) => v.infNFe.dest)
    .map((v) => v.infNFe.dest)
    .map((v) => ({ id: v.CPF ?? v.CNPJ ?? v.idEstrangeiro, v }))
    .filter((v) => v.id && v.v.xNome)
    .filter((v, i, a) => a.findIndex((k) => k.id == v.id) == i)
  log(`Encontrados ${clientes.length} clientes.`)
  for (let i = 0; i < clientes.length; i++) {
    const { id, v: dest } = clientes[i]
    const clienteRef = doc(colecao, id)
    if (possuiCadastros) {
      const salvo = await getDoc(clienteRef)
      if (salvo.exists()) {
        log(`Cliente ${id} rejeitado: já está registrado.`)
        continue
      }
    }
    await setDoc(clienteRef, { dest })
    log(`Cliente ${id} aceito e registrado no banco de dados.`)
  }
}

export async function processarTransportes(
  refEmpresa: DocumentReference,
  notas: INotaDB[],
  log: (v: string) => void
) {
  log(`Iniciando busca de transportes em ${notas.length} notas...`)
  const colecao = collection(refEmpresa, Dados.Transportes)
  const possuiCadastros = getPossuiCadastros(colecao)
  const transportes = notas
    .map((v) => v.infNFe.transp.transporta)
    .filter((v) => v)
    .map((v) => ({ id: v.CPF ?? v.CNPJ, v }))
    .filter((v) => v.id && v.v.xNome)
    .filter((v, i, a) => a.findIndex((k) => k.id == v.id) == i)
  log(`Encontrados ${transportes.length} transportes.`)
  for (let i = 0; i < transportes.length; i++) {
    const { id, v: transporta } = transportes[i]
    const transportaRef = doc(colecao, id)
    if (possuiCadastros) {
      const salvo = await getDoc(transportaRef)
      if (salvo.exists()) {
        log(`Transporte ${id} rejeitado: já está registrado.`)
        continue
      }
    }
    await setDoc(transportaRef, { transporta })
    log(`Cliente ${id} aceito e registrado no banco de dados.`)
  }
}

export async function processarProdutos(
  refEmpresa: DocumentReference,
  notas: INotaDB[],
  log: (v: string) => void
) {
  log(`Iniciando busca de produtos em ${notas.length} notas...`)
  const colecao = collection(refEmpresa, Dados.Produtos)
  const possuiCadastros = getPossuiCadastros(colecao)
  if (possuiCadastros) {
    log(`Busca de produtos cancelada: já existem produtos registrados.`)
    return
  }
  const produtos = notas
    .flatMap((v) => v.infNFe.det as any[])
    .map((v) => ({ noid: v.prod.cProd.startsWith('CFOP') as boolean, v }))
    .map((v) => ({ ...v, id: v.noid ? v.v.prod.xProd : v.v.prod.cProd }))
    .map((v) => ({ ...v, idcfop: (v.id + v.v.prod.CFOP) as string }))
    .filter((v, i, a) => a.findIndex((k) => k.idcfop == v.idcfop) == i)
  log(`Encontrados ${produtos.length} produtos.`)
  for (let i = 0; i < produtos.length; i++) {
    const item = produtos[i]
    log(`Analisando produto ${item.v.prod.xProd}...`)
    if (item.noid) {
      log(`Não possui código, gerando um...`)
      const proibidos = produtos.map((v) => v.id)
      const novoId = idAleatorio(6, proibidos)
      item.v.prod.cProd = novoId
      item.id = novoId
      log(`Código aleatório atribuído: ${novoId}`)
    }
    const id = item.id
    const det = item.v
    const semGTIN = 'SEM GTIN'
    if (!det.prod.cEAN) {
      det.prod.cEAN = semGTIN
      log(`Código de barros fora do padrão, atribuindo ${semGTIN}.`)
    }
    if (!det.prod.cEANTrib) {
      det.prod.cEANTrib = semGTIN
      log(`Código de barros tributável fora do padrão, atribuindo ${semGTIN}.`)
    }
    const produtoRef = doc(colecao, id)
    await setDoc(produtoRef, { det })
    log(`Produto ${id} aceito e registrado no banco de dados.`)
  }
}

async function getPossuiCadastros(colecao: CollectionReference) {
  const res = await getDocs(query(colecao, limit(1)))
  return !res.empty
}
