export async function gerarDANFENFe(xml: string) {
  const parametros = {
    xml: xml.replace(/>\s+</g, '><'),
    orientacao: 'P',
    margSup: 5,
    margEsq: 5,
  }
  const enderecoAPI =
    'https://us-central1-nfe-facil-980bc.cloudfunctions.net/helloWorld'
  const corpoRequisicao = {
    method: 'POST',
    body: JSON.stringify(parametros),
  }
  const danfe = await fetch(enderecoAPI, corpoRequisicao)
  const pdf = danfe.blob()
  const enderecoPDF = window.URL.createObjectURL(pdf)
  window.open(enderecoPDF)
}
