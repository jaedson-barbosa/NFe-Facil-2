import {
  gerarDANFENFe as _gerarDANFENFe,
  cancelarNFe as _cancelarNFe,
} from './functions'
import { toNFeString } from './toNFeString'

export async function gerarDANFENFe(
  cnpj: string,
  idNota: string,
  emitida: boolean
) {
  const resp = await _gerarDANFENFe({
    idEmpresa: cnpj,
    emitida,
    idNota,
  })
  if (!resp) return
  const byteCharacters = atob(resp)
  const blob = new Blob(
    [
      new Uint8Array(
        [...new Array(byteCharacters.length)].map((v, i) =>
          byteCharacters.charCodeAt(i)
        )
      ),
    ],
    { type: 'application/pdf' }
  )
  const url = window.URL.createObjectURL(blob)
  window.open(url)
}

export async function cancelarNFe(cnpj: string, idNota: string) {
  const justificativa = prompt('Motivação do cancelamento:')
  if (!justificativa) {
    alert('Operação cancelada pelo usuário')
    return
  }
  if (
    await _cancelarNFe({
      idEmpresa: cnpj,
      idNota,
      justificativa,
      dhEvento: toNFeString(new Date()),
    })
  )
    alert('Nota fiscal cancelada com sucesso.')
}
