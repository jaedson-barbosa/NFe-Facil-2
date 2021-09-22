import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  Timestamp,
} from 'firebase/firestore'
import * as parser from 'xml2json-light-es6module'
import { Dados, INotaDB } from '../tipos'
import { getPossuiCadastros } from './commom'

export async function processarNotas(
  refEmpresa: DocumentReference,
  arquivos: FileList,
  log: (v: string) => void
) {
  const colecao = collection(refEmpresa, Dados.NFes)
  const possuiCadastros = await getPossuiCadastros(colecao)
  const notas = await getNFes(refEmpresa.id, arquivos, colecao, possuiCadastros)
  const listaAceitas = notas.map((v) => v.nfeRef.id).join(', ')
  log(`${notas.length} notas foram aceitas: ${listaAceitas}.`)
  return notas.sort((a, b) => (a.nfeData.dhEmi > b.nfeData.dhEmi ? -1 : 1))
}

async function getNFes(
  cnpj: string,
  arquivos: FileList,
  colecao: CollectionReference,
  analisarPresenca: boolean
) {
  async function getNFe(index: number) {
    try {
      const arquivo = arquivos[index]
      const xml = await arquivo.text()
      const json = parser.xml2json(xml)
      const nfeProc = json.nfeProc
      const infNFe = nfeProc.NFe.infNFe
      const id = infNFe.Id
      if (!id) return undefined
      const versao = infNFe.versao
      if (versao != '4.00') return undefined
      const tpNF = infNFe.ide.tpNF
      if (tpNF != '1') return undefined
      const CNPJ = infNFe.emit.CNPJ
      if (CNPJ != cnpj) return undefined
      const nfeRef = doc(colecao, id)
      if (analisarPresenca) {
        const salva = await getDoc(nfeRef)
        if (salva.exists()) return undefined
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
      return { nfeRef, nfeData }
    } catch (error) {
      return undefined
    }
  }

  const vetorArquivos = [...Array(arquivos.length)]
  const analiseArquivos = vetorArquivos.map((_, i) => getNFe(i))
  const resultadoAnaliseArquivos = await Promise.all(analiseArquivos)
  let notas = resultadoAnaliseArquivos.filter((v) => v)
  return notas
}
