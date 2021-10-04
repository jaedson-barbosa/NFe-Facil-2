import { collection, doc, DocumentReference, getDoc } from 'firebase/firestore'
import { Dados, INotaDB } from '../tipos'
import { getPossuiCadastros } from './commom'

export async function processarVeiculos(
  refEmpresa: DocumentReference,
  notas: INotaDB[],
  log: (v: string) => void
) {
  const colecao = collection(refEmpresa, Dados.Veiculos)
  const possuiCadastros = await getPossuiCadastros(colecao)
  const veicTransps = notas
    .map((v) => v.infNFe.transp.veicTransp)
    .filter((v) => v)
  const reboques = notas
    .map((v) => v.infNFe.transp.reboque)
    .filter((v) => v)
    .flatMap((v) => v)
  const veiculos = [...veicTransps, ...reboques]
    .filter((v) => v.placa && v.UF)
    .filter((v, i, a) => a.findIndex((k) => k.placa == v.placa) == i)
    .map((data) => ({ ref: doc(colecao, data.placa), data }))
  if (possuiCadastros) {
    for (let i = veiculos.length - 1; i >= 0; i--) {
      const salva = await getDoc(veiculos[i].ref)
      if (salva.exists()) veiculos.splice(i, 1)
    }
  }
  if (veiculos.length) {
    const listaAceitos = veiculos.map((v) => v.data.placa).join(', ')
    log(`${veiculos.length} veículos foram aceitos: ${listaAceitos}.`)
  }
  return veiculos
}
