import * as parser from 'xml2json-light-es6module'

export async function getArquivos(arquivos: FileList): Promise<IConteudo[]> {
  async function getArquivo(index: number) {
    try {
      const arquivo = arquivos[index]
      const xml = await arquivo.text()
      const json = parser.xml2json(xml)
      const { nfeProc, procEventoNFe } = json
      return (nfeProc || procEventoNFe) && { xml, nfeProc, procEventoNFe }
    } catch (error) {
      return undefined
    }
  }

  const vetorArquivos = [...Array(arquivos.length)]
  const analiseArquivos = vetorArquivos.map((_, i) => getArquivo(i))
  const resultadoAnaliseArquivos = await Promise.all(analiseArquivos)
  return resultadoAnaliseArquivos.filter((v) => v)
}

export interface IConteudo {
  xml: string
  nfeProc?: any
  procEventoNFe?: any
}
