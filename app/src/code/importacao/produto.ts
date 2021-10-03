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
  const codigos = produtos
    .map((v) => v.prod.cProd as string)
    .filter((v) => !v.startsWith('CFOP'))
    .filter((v, i, a) => a.indexOf(v) === i)
  const corrigidos: { ref: DocumentReference; data: { det: any } }[] = []
  for (const codigo of codigos) {
    const prodsCodigo = produtos.filter((v) => v.prod.cProd === codigo)
    const cfops = prodsCodigo
      .map((v) => v.prod.CFOP as string)
      .filter((v, i, a) => a.indexOf(v) === i)
    for (const cfop of cfops) {
      const det = prodsCodigo.find(v => v.prod.CFOP === cfop)
      const ref = doc(colecao, codigo + cfop)
      const novo = { ref, data: { det } }
      if (!det.prod.cEAN) det.prod.cEAN = 'SEM GTIN'
      if (!det.prod.cEANTrib) det.prod.cEANTrib = 'SEM GTIN'
      if (possuiCadastros) {
        const salva = await getDoc(ref)
        if (!salva.exists()) corrigidos.push(novo)
      } else corrigidos.push(novo)
    }
  }
  if (corrigidos.length) {
    const listaAceitos = corrigidos.map((v) => v.data.det.prod.xProd).join(', ')
    log(`${corrigidos.length} produtos foram aceitos: ${listaAceitos}.`)
  }
  return corrigidos
}
