import { IViewNota } from '../../commom'
import { gerarDANFE, getXML } from '../functions'

export function renderizarNota(data: { infNFe: IViewNota<number> }): string {
  return /*html*/ `
    <div>Nº ${data.infNFe.nNF}   <small>SÉRIE ${data.infNFe.serie}</small><br>${
    data.infNFe.xNome
  }<br>
    <small><i>${new Date(data.infNFe.dhEmi).toLocaleString()}</i></small></div>`
}

export async function baixarDANFE(idNota: string) {
  const pdf = await gerarDANFE(idNota)
  const saveData = (function () {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    return function (blob, fileName) {
      var url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    }
  })()
  saveData(pdf, 'teste.pdf')
}

export async function baixarXML(idNota: string) {
  const xml = await getXML(idNota)
  const saveData = (function () {
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    return function (xml: string, fileName: string) {
      const blob = new Blob([xml], { type: 'application/xml' }),
        url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    }
  })()
  saveData(xml.xml, xml.chave + '.xml')
}
