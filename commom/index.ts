export interface IResultadoImportacao {
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
    infNFe: IViewNota
  }[]
}

export interface IResultadoSincronizacao {
  novosDados: {
    id: string
    data: any
  }[]
  novasNotas: {
    id: string
    infNFe: IViewNota
  }[]
  now: number
}

export interface IViewNota {
  serie: any
  nNF: any
  dhEmi: Date
  xNome: any
}
