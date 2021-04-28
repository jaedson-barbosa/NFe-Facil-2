export interface IResultadoImportacao {
  clientes: {
    id: string
    data: {
      dest: any
      lastUpdate: Date
    }
  }[]
  produtos: {
    id: string
    data: {
      prod: any
      lastUpdate: Date
    }
  }[]
  motoristas: {
    id: string
    data: {
      transporta: any
      lastUpdate: Date
    }
  }[]
  notas: {
    id: string
    data: IViewNota
  }[]
}

export interface IViewNota {
  serie: any
  nNF: any
  dhEmi: Date
  xNome: any
}

export interface INotaDB<TDate> {
  json: any
  xml: string
  emitido: boolean
  lastUpdate: TDate
  view: {
    serie: any
    nNF: any
    dhEmi: TDate
    xNome: any
  }
}
