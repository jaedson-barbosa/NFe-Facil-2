export interface IScoped {
  idEmpresa: string
  files: FileList
  nfes: any[]
  importarClientes: boolean
  importarProdutos: boolean
  importarTransportes: boolean
  getNext: (cur?: './clientes' | './produtos' | './transportes') => string
}
