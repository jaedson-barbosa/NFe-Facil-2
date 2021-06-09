export interface IScoped {
  files: FileList
  nfes: any[]
  importarClientes: boolean
  importarProdutos: boolean
  importarTransportes: boolean
  getNext: (cur?: './clientes' | './produtos' | './transportes') => string
}
