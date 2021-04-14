import { entries } from "../db"

type TiposDados = 'dest' | 'prod' | 'transporta'

export async function getItens(tipo: TiposDados) {
    const totalItens = await entries()
    return totalItens.filter(v => v[1][tipo])
}
