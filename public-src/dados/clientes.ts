import { elementosNFe, generateView, fieldsetFormElement } from '../form-base'

export function renderizarCliente(data: { dest: any }): string {
  return /*html*/ `
    <div>${data.dest.xNome}<br>
    <small><i>${data.dest.enderDest.xLgr}</i></small></div>`
}

export function gerarViewCliente() {
  return generateView(elementosNFe[2]) as fieldsetFormElement
}
