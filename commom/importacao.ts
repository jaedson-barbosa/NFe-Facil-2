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
  notas: any[]
}
