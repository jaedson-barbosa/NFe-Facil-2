export interface IResultadoImportacao<TDate> {
  clientes: {
    id: string
    dest: any
  }[]
  produtos: {
    id: string
    prod: any
  }[]
  motoristas: {
    id: string
    transporta: any
  }[]
  notas: {
    id: string
    infNFe: IViewNota<TDate>
  }[]
}

export interface IResultadoSincronizacao<TDate> {
  novosDados: {
    id: string
    data: any
  }[]
  novasNotas: {
    id: string
    infNFe: IViewNota<TDate>
  }[]
  now: number
}

export interface IViewNota<TDate> {
  serie: any
  nNF: any
  dhEmi: TDate
  xNome: string
  Id: string
  eventos: string[]
}
