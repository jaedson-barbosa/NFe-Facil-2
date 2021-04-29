import { IViewNota } from '../../commom'

export function renderizarNota(data: { infNFe: IViewNota }): string {
  return /*html*/ `
    <div>${data.infNFe.nNF} (${data.infNFe.serie})<br>${data.infNFe.xNome}<br>
    <small><i>${new Date(data.infNFe.dhEmi).toLocaleString()}</i></small></div>`
}

export function gerarDANFE(idNota: string) {

}

export function baixarXML(idNota: string) {

}
