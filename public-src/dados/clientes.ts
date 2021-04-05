import { defaultForm } from "../form-base"

export function renderizarCliente(data: {dest: any}): HTMLButtonElement {
    const div = document.createElement('button')
    div.innerHTML = /*html*/ `
    <div>${data.dest.xNome}
    <i>${data.dest.enderDest.xLgr}</i></div>`
    return div
}

export function gerarViewCliente() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[3],
        { customRequireds: ['dest', 'xNome', 'enderDest'] })
}