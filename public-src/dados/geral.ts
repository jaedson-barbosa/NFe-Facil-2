import { entries } from '../db'

export type TDados = TDadosBase | TNota
export type TDadosBase = 'dest' | 'prod' | 'transporta'
export type TNota = 'infNFe'

export async function getItens(tipo: TDados) {
  const totalItens = await entries()
  return totalItens.filter((v) => v[1][tipo])
}
