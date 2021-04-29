import { setMany } from '../db'
import { sincronizar } from '../functions'

export async function getLastAlteracoes() {
  alert('Pedido de sincronização')
  const resp = await sincronizar()
  console.log(resp)
  await setMany(resp.novosDados.map((v) => [v.id, v.data]))
  await setMany(resp.novasNotas.map((v) => [v.id, { infNFe: v.infNFe }]))
}
