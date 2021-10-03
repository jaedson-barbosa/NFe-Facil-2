import { collection, doc, DocumentReference } from 'firebase/firestore'
import { Dados, INotaDB } from '../tipos'
import { getPossuiCadastros } from './commom'
import idAleatorio from '../idAleatorio'

export async function processarProdutos(
  refEmpresa: DocumentReference,
  notas: INotaDB[],
  log: (v: string) => void
) {
  const colecao = collection(refEmpresa, Dados.Produtos)
  const possuiCadastros = await getPossuiCadastros(colecao)
  if (possuiCadastros) {
    log(`Busca de produtos cancelada: já existem produtos registrados.`)
    return undefined
  }
  const produtos = notas
    .flatMap((v) => v.infNFe.det as any[])
    .map((v) => ({ noid: v.prod.cProd.startsWith('CFOP') as boolean, v }))
    .map((v) => ({ ...v, id: v.noid ? v.v.prod.xProd : v.v.prod.cProd }))
    .map((v) => ({ ...v, idcfop: (v.id + v.v.prod.CFOP) as string }))
    .filter((v, i, a) => a.findIndex((k) => k.idcfop == v.idcfop) == i)
  const corrigidos = produtos.map((v, i) => {
    const item = produtos[i]
    if (item.noid || produtos.findIndex((k) => k.id == item.id) != i) {
      const proibidos = produtos.map((v) => v.id)
      const novoId = idAleatorio(6, proibidos)
      item.id = item.v.prod.cProd = novoId
    }
    const det = item.v
    if (!det.prod.cEAN) det.prod.cEAN = 'SEM GTIN'
    if (!det.prod.cEANTrib) det.prod.cEANTrib = 'SEM GTIN'
    return { ref: doc(colecao, item.id), data: { det } }
  })
  if (corrigidos.length) {
    const listaAceitos = corrigidos.map((v) => v.data.det.prod.xProd).join(', ')
    log(`${corrigidos.length} produtos foram aceitos: ${listaAceitos}.`)
  }
  return corrigidos
}
