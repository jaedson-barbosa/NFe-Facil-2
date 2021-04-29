import { setMany } from '../db'
import { sincronizar } from '../functions'

export async function getLastAlteracoes() {
  const resp = await sincronizar()
  await setMany(resp.novosDados.map((v) => [v.id, v.data]))
  await setMany(resp.novasNotas.map((v) => [v.id, { infNFe: v.infNFe }]))
}
