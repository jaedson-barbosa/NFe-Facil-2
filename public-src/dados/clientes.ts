import { defaultForm, fieldsetFormElement } from "../form-base"

export function renderizarCliente(data: {dest: any}): HTMLButtonElement {
    const div = document.createElement('button')
    div.innerHTML = /*html*/ `
    <div>${data.dest.xNome}
    <i>${data.dest.enderDest.xLgr}</i></div>`
    return div
}

export function gerarViewCliente() {
    const views = defaultForm.generateView(
        defaultForm.elementosNFe[3],
        { customRequireds: ['dest', 'xNome', 'enderDest'] })
    const view = views[0] as fieldsetFormElement
    return view
}