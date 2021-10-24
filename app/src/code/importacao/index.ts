import { getArquivos } from './arquivo'
import { processarNotas } from './nfe'
import { processarClientes } from './cliente'
import { processarTransportes } from './transporte'
import { processarProdutos } from './produto'
import { processarVeiculos } from './veiculo'
import { filtrarCancelamentos } from './cancelamento'
import { DocumentReference, writeBatch } from 'firebase/firestore'
import { db } from '../firebase'

export async function processarArquivos(
  ref: DocumentReference,
  arquivos: FileList,
  log: (v: string) => void
) {
  log(`Iniciando análise de ${arquivos.length} arquivos...`)
  const conteudos = await getArquivos(arquivos)
  const conteudosNotas = conteudos.filter((v) => v.nfeProc)
  const conteudosCancelamentos = conteudos.filter((v) => v.procEventoNFe)
  const cancelamentos = filtrarCancelamentos(conteudosCancelamentos)
  const notas = await processarNotas(ref, conteudosNotas, cancelamentos, log)
  if (notas.novasNotas.length || notas.updatesNotas.length) {
    const lote = writeBatch(db)
    if (notas.novasNotas.length) {
      notas.novasNotas.forEach((v) => lote.set(v.nfeRef, v.nfeData))

      const dataNotas = notas.novasNotas.map((v) => v.nfeData)

      const clientes = await processarClientes(ref, dataNotas, log)
      clientes.forEach((v) => lote.set(v.ref, v.data))

      const transportes = await processarTransportes(ref, dataNotas, log)
      transportes.forEach((v) => lote.set(v.ref, v.data))

      const veiculos = await processarVeiculos(ref, dataNotas, log)
      veiculos.forEach((v) => lote.set(v.ref, v.data))

      const dets = await processarProdutos(ref, dataNotas, log)
      dets.produtos.forEach((v) => lote.set(v.ref, v.data))
      dets.impostos.forEach((v) => lote.set(v.ref, v.data))
    }
    if (notas.updatesNotas.length) {
      notas.updatesNotas.forEach((v) => lote.update(v.nfeRef, v.nfeData))
    }
    log('Enviando alterações ao banco de dados...')
    await lote.commit()
    log('Importação concluída.')
  } else alert('Nenhuma nova nota fiscal ou cancelamento.')
}
