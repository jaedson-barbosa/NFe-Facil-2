import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore'
import { limparComb } from '../imposto/CIDE'
import { limparICMS } from '../imposto/ICMS'
import { limparIPI } from '../imposto/IPI'
import { limparPISCOFINS } from '../imposto/PISCOFINS'
import { calcularIdImposto } from '../imposto/registro'
import { Dados, INotaDB } from '../tipos'
import { getPossuiCadastros } from './commom'

export async function processarProdutos(
  refEmpresa: DocumentReference,
  notas: INotaDB[],
  log: (v: string) => void
) {
  const colecaoProdutos = collection(refEmpresa, Dados.Produtos)
  const produtos = notas.flatMap((v) => v.infNFe.det as any[])
  const filtrados: { ref: DocumentReference; det: any }[] = produtos
    .map((v) => v.prod.cProd as string)
    .filter((v) => !v.startsWith('CFOP'))
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((codigo) => {
      const ref = doc(colecaoProdutos, codigo)
      const det = produtos.find((v) => v.prod.cProd === codigo)
      if (!det.prod.cEAN) det.prod.cEAN = 'SEM GTIN'
      if (!det.prod.cEANTrib) det.prod.cEANTrib = 'SEM GTIN'
      return { ref, det }
    })
  if (await getPossuiCadastros(colecaoProdutos)) {
    for (let i = filtrados.length - 1; i >= 0; i--) {
      const salva = await getDoc(filtrados[i].ref)
      if (salva.exists()) filtrados.splice(i, 1)
    }
  }
  const prods = filtrados.map((v) => ({
    ref: v.ref,
    data: { prod: limparProduto(v.det.prod) } as any,
  }))
  const colecaoImpostos = collection(refEmpresa, Dados.Impostos)
  const impostos = (
    await Promise.all(
      filtrados
        .map((v) => limparImpostos(v.det.imposto))
        .map((v, i, a) => a.find((k) => deepEqual(v, k)))
        .map(async (imposto, i) => {
          const id = await calcularIdImposto(imposto)
          prods[i].data.perfilTributario = id
          return { id, data: { descricao: id, imposto } }
        })
        .filter((v, i, a) => a.findIndex((k) => deepEqual(v, k)) === i)
    )
  )
    .filter((v, i, a) => a.findIndex((k) => k.id === v.id) === i)
    .map(({ id, data }) => ({ ref: doc(colecaoImpostos, id), data }))
  if (await getPossuiCadastros(colecaoImpostos)) {
    for (let i = impostos.length - 1; i >= 0; i--) {
      const salva = await getDoc(impostos[i].ref)
      if (salva.exists()) impostos.splice(i, 1)
    }
  }
  if (prods.length) {
    const listaAceitos = prods.map((v) => v.data.prod.xProd).join(', ')
    log(`${prods.length} produtos foram aceitos: ${listaAceitos}.`)
  }
  if (impostos.length) {
    const listaAceitos = impostos.map((v) => v.ref.id).join(', ')
    log(`${impostos.length} impostos foram aceitos: ${listaAceitos}.`)
  }
  return { produtos: prods, impostos }
}

function limparProduto(prodO: any) {
  const prod: any = {
    cProd: prodO.cProd,
    xProd: prodO.xProd,
    NCM: prodO.NCM,
    CFOP: prodO.CFOP,
    cEAN: prodO.cEAN,
    uCom: prodO.uCom,
    vUnCom: prodO.vUnCom,
    cEANTrib: prodO.cEANTrib,
    uTrib: prodO.uTrib,
    vUnTrib: prodO.vUnTrib,
  }
  if (prodO.NVE) prod.NVE = prodO.NVE
  if (prodO.CEST) prod.CEST = prodO.CEST
  if (prodO.indEscala) prod.indEscala = prodO.indEscala
  if (prodO.CNPJFab) prod.CNPJFab = prodO.CNPJFab
  if (prodO.cBenef) prod.cBenef = prodO.cBenef
  if (prodO.EXTIPI) prod.EXTIPI = prodO.EXTIPI
  if (prodO.veicProd) prod.veicProd = prodO.veicProd
  if (prodO.med) prod.med = prodO.med
  if (prodO.arma) prod.arma = prodO.arma
  if (prodO.comb) {
    limparComb(prodO.comb)
    prod.comb = prodO.comb
  }
  if (prodO.nRECOPI) prod.nRECOPI = prodO.nRECOPI
  return prod
}

function limparImpostos(imposto: any) {
  limparICMS(imposto)
  limparIPI(imposto)
  limparPISCOFINS(imposto)
  delete imposto.II
  delete imposto.ICMSUFDest
  return imposto
}

// https://stackoverflow.com/questions/25456013/javascript-deepequal-comparison
function deepEqual(obj1: any, obj2: any) {
  //check if value is primitive
  function isPrimitive(obj) {
    return obj !== Object(obj)
  }

  if (obj1 === obj2)
    // it's just the same object. No need to compare.
    return true

  if (isPrimitive(obj1) && isPrimitive(obj2))
    // compare primitives
    return obj1 === obj2

  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false

  // compare objects with same number of keys
  for (let key in obj1) {
    if (!(key in obj2)) return false //other object doesn't have this prop
    if (!deepEqual(obj1[key], obj2[key])) return false
  }

  return true
}
