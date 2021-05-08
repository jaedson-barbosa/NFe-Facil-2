import { IViewNota } from '../../commom'
import { cancelarNFe, gerarDANFE, getXML } from '../functions'
import { toNFeString } from '../nfe'

export function renderizarNota(data: { infNFe: IViewNota<number> }): string {
  return /*html*/ `
  <div>Nº ${data.infNFe.nNF}   <small>SÉRIE ${data.infNFe.serie}</small><br>${
    data.infNFe.xNome
  }<br>
  <small><i>${new Date(data.infNFe.dhEmi).toLocaleString()}</i></small>
  ${data.infNFe.eventos.includes('Cancelamento') ? '<br>Nota cancelada' : ''}
  </div>`
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

export async function cancelarNFeEmitida(idNota: string) {
  const justificativa = prompt('Motivação do cancelamento:')
  if (!justificativa) {
    alert('Operação cancelada pelo usuário')
    return
  }
  const resp = await cancelarNFe(idNota, justificativa, toNFeString(new Date()))
  if (resp) {
    alert('Nota fiscal cancelada com sucesso')
    location.reload()
  }
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
