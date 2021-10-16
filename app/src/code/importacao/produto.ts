import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore'
import { Dados, INotaDB } from '../tipos'
import { getPossuiCadastros } from './commom'

export async function processarProdutos(
  refEmpresa: DocumentReference,
  notas: INotaDB[],
  log: (v: string) => void
) {
  const colecao = collection(refEmpresa, Dados.Produtos)
  const possuiCadastros = await getPossuiCadastros(colecao)
  const produtos = notas.flatMap((v) => v.infNFe.det as any[])
  const filtrados: { ref: DocumentReference; data: { det: any } }[] = produtos
    .map((v) => v.prod.cProd as string)
    .filter((v) => !v.startsWith('CFOP'))
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((codigo) => {
      const ref = doc(colecao, codigo)
      const det = produtos.find((v) => v.prod.cProd === codigo)
      if (!det.prod.cEAN) det.prod.cEAN = 'SEM GTIN'
      if (!det.prod.cEANTrib) det.prod.cEANTrib = 'SEM GTIN'
      return { ref, data: { det } }
    })
  if (possuiCadastros) {
    for (let i = filtrados.length - 1; i >= 0; i--) {
      const salva = await getDoc(filtrados[i].ref)
      if (salva.exists()) filtrados.splice(i, 1)
    }
  }
  if (filtrados.length) {
    const listaAceitos = filtrados.map((v) => v.data.det.prod.xProd).join(', ')
    log(`${filtrados.length} produtos foram aceitos: ${listaAceitos}.`)
  }
  return filtrados
}
