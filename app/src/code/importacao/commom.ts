import { CollectionReference, getDocs, limit, query } from 'firebase/firestore'

export async function getPossuiCadastros(colecao: CollectionReference) {
  console.log(colecao.path)
  const consulta = query(colecao, limit(1))
  const res = await getDocs(consulta)
  console.log(res.docs.length)
  return !res.empty
}
