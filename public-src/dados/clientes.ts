import { elementosNFe, generateView, fieldsetFormElement } from '../form-base'

export function renderizarCliente(data: { dest: any }): string {
  return /*html*/ `
    <div>${data.dest.xNome}<br>
    <small><i>${data.dest.enderDest.xLgr}</i></small></div>`
}

export function gerarViewCliente() {
  const views = generateView(elementosNFe[3], {
    customRequireds: ['dest', 'xNome', 'enderDest'],
  })
  const view = views[0] as fieldsetFormElement
  return view
}
