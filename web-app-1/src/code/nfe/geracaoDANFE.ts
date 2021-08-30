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