import { IViewNota } from '../../commom'
import { getXML } from '../functions'

export function renderizarNota(data: { infNFe: IViewNota<number> }): string {
  return /*html*/ `
    <div>Nº ${data.infNFe.nNF}   <small>SÉRIE ${data.infNFe.serie}</small><br>${
    data.infNFe.xNome
  }<br>
    <small><i>${new Date(data.infNFe.dhEmi).toLocaleString()}</i></small></div>`
}

export function gerarDANFE(idNota: string) {}

export async function baixarXML(idNota: string) {
  const xml = await getXML(idNota)
  var saveData = (function () {
    var a = document.createElement('a')
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
