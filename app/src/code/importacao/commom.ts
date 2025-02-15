import { CollectionReference, getDocs, limit, query } from 'firebase/firestore'

export async function getPossuiCadastros(colecao: CollectionReference) {
  const consulta = query(colecao, limit(1))
  const res = await getDocs(consulta)
  return !res.empty
}
