import { setMany } from '../db'
import { sincronizar } from '../functions'

export async function getLastAlteracoes() {
  const resp = await sincronizar()
  if (resp.novosDados.length > 0) {
    await setMany(resp.novosDados.map((v) => [v.id, v.data]))
  }
  if (resp.novasNotas.length > 0) {
    await setMany(resp.novasNotas.map((v) => [v.id, { infNFe: v.infNFe }]))
  }
}
