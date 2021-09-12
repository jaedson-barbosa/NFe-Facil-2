import { processarNotas } from './nfe'
import { processarClientes } from './cliente'
import { processarTransportes } from './transporte'
import { processarProdutos } from './produto'
import { DocumentReference, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'

export async function processarArquivos(
  ref: DocumentReference,
  arquivos: FileList,
  log: (v: string) => void
) {
  log(`Iniciando análise de ${arquivos.length} arquivos...`)
  const notas = await processarNotas(ref, arquivos, log)
  if (notas.length) {
    const lote = writeBatch(db)
    notas.forEach((v) => lote.set(v.nfeRef, v.nfeData))

    const dataNotas = notas.map((v) => v.nfeData)
    const clientes = await processarClientes(ref, dataNotas, log)
    clientes.forEach((v) => lote.set(v.ref, v.data))

    const transportes = await processarTransportes(ref, dataNotas, log)
    transportes.forEach((v) => lote.set(v.ref, v.data))

    const produtos = await processarProdutos(ref, dataNotas, log)
    if (produtos) produtos.forEach((v) => lote.set(v.ref, v.data))

    log('Enviando alterações ao banco de dados...')
    await lote.commit()
  } else alert('Nenhuma mudança.')
}
