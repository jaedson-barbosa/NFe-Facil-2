import { toNFeString } from '../getDataString'

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