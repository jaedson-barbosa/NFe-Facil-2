import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore'
import { Dados, INotaDB } from '../tipos'
import { getPossuiCadastros } from './commom'

export async function processarClientes(
  refEmpresa: DocumentReference,
  notas: INotaDB[],
  log: (v: string) => void
) {
  const colecao = collection(refEmpresa, Dados.Clientes)
  const possuiCadastros = await getPossuiCadastros(colecao)
  const homolog = 'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
  const clientes = notas
    .filter((v) => v.infNFe.dest)
    .map((v) => v.infNFe.dest)
    .map((v) => ({ id: v.CPF ?? v.CNPJ ?? v.idEstrangeiro, v }))
    .filter((v) => v.id && v.v.xNome && v.v.xNome != homolog)
    .filter((v, i, a) => a.findIndex((k) => k.id == v.id) == i)
  if (possuiCadastros) {
    for (let i = clientes.length - 1; i >= 0; i--) {
      const ref = doc(colecao, clientes[i].id)
      const salva = await getDoc(ref)
      if (salva.exists()) clientes.splice(i, 1)
    }
  }
  if (clientes.length) {
    const listaAceitos = clientes.map(({ v }) => v.xNome).join(', ')
    log(`${clientes.length} clientes foram aceitos: ${listaAceitos}.`)
  }
  return clientes.map((v) => ({ ref: doc(colecao, v.id), data: { dest: v.v } }))
}
