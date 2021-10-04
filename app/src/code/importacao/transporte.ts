import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore'
import { Dados, INotaDB } from '../tipos'
import { getPossuiCadastros } from './commom'

export async function processarTransportes(
  refEmpresa: DocumentReference,
  notas: INotaDB[],
  log: (v: string) => void
) {
  const colecao = collection(refEmpresa, Dados.Transportes)
  const possuiCadastros = await getPossuiCadastros(colecao)
  const transportes = notas
    .map((v) => v.infNFe.transp.transporta)
    .filter((v) => v)
    .map((v) => ({ id: v.CPF ?? v.CNPJ, v }))
    .filter((v) => v.id && v.v.xNome)
    .filter((v, i, a) => a.findIndex((k) => k.id == v.id) == i)
  if (possuiCadastros) {
    for (let i = transportes.length - 1; i >= 0; i--) {
      const ref = doc(colecao, transportes[i].id)
      const salva = await getDoc(ref)
      if (salva.exists()) transportes.splice(i, 1)
    }
  }
  if (transportes.length) {
    const listaAceitos = transportes.map(({ v }) => v.xNome).join(', ')
    log(`${transportes.length} transportes foram aceitos: ${listaAceitos}.`)
  }
  return transportes.map((v) => ({
    ref: doc(colecao, v.id),
    data: { transporta: v.v },
  }))
}
