import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  Timestamp,
} from 'firebase/firestore'
import { preparateJSON } from '../nfe/finalizacao'
import { Dados, INotaDB } from '../tipos'
import type { IConteudo } from './arquivo'
import type { ICancelamento } from './cancelamento'
import { getPossuiCadastros } from './commom'

export async function processarNotas(
  refEmpresa: DocumentReference,
  conteudos: IConteudo[],
  cancelamentos: ICancelamento[],
  log: (v: string) => void
) {
  const colecao = collection(refEmpresa, Dados.NFes)
  const possuiCadastros = await getPossuiCadastros(colecao)
  const cnpj = refEmpresa.id
  const notas = conteudos
    .map((v) => getNFe(v, cnpj, colecao, cancelamentos))
    .filter((v) => v)
    .filter((v, i, a) => a.findIndex((k) => k.nfeRef.id == v.nfeRef.id) === i)
  if (possuiCadastros) {
    await Promise.all(
      notas.map((v, i) =>
        getDoc(v.nfeRef).then((k) => k.exists() && notas.splice(i, 1))
      )
    )
  }
  let updatesNotas: { nfeRef: DocumentReference; nfeData: any }[] = []
  if (possuiCadastros) {
    for (const cancelamento of cancelamentos) {
      if (notas.some((k) => cancelamento.id === k.nfeRef.id)) continue
      const ref = doc(colecao, cancelamento.id)
      const res = await getDoc(ref)
      if (res.exists() && !res.get('cancelada')) {
        const xmlCancelamento = cancelamento.xml
        const nfeData = { cancelada: true, xmlCancelamento }
        updatesNotas.push({ nfeRef: ref, nfeData })
      }
    }
  }
  if (notas.length) {
    const listaAceitas = notas.map((v) => v.nfeRef.id).join(', ')
    log(`${notas.length} notas foram aceitas: ${listaAceitas}.`)
  }
  if (updatesNotas.length) {
    const listaAceitas = updatesNotas.map((v) => v.nfeRef.id).join(', ')
    const texto = 'notas serão atualizadas com o evento de cancelamento:'
    log(`${updatesNotas.length} ${texto} ${listaAceitas}.`)
  }
  return {
    novasNotas: notas.sort((a, b) =>
      a.nfeData.dhEmi > b.nfeData.dhEmi ? -1 : 1
    ),
    updatesNotas,
  }
}

function getNFe(
  { xml, nfeProc }: IConteudo,
  cnpj: string,
  colecao: CollectionReference,
  cancelamentos: ICancelamento[]
) {
  try {
    const infNFe = nfeProc.NFe.infNFe
    if (!infNFe) return undefined
    const id = infNFe.Id
    if (!id) return undefined
    const versao = infNFe.versao
    if (versao != '4.00') return undefined
    const CNPJ = infNFe.emit.CNPJ
    if (CNPJ != cnpj) return undefined
    const nfeRef = doc(colecao, id)
    const dhEmi = new Date(nfeProc.protNFe.infProt.dhRecbto)
    const nProt = nfeProc.protNFe.infProt.nProt
    const cancelamento = cancelamentos.find((v) => v.id === id)
    const nfeData: INotaDB = {
      infNFe: preparateJSON(infNFe),
      dhEmi: Timestamp.fromDate(dhEmi),
      cancelada: !!cancelamento,
      nProt,
      xml,
    }
    if (cancelamento) {
      nfeData.xmlCancelamento = cancelamento.xml
    }
    return { nfeRef, nfeData }
  } catch (error) {
    console.log(error)
    return undefined
  }
}
