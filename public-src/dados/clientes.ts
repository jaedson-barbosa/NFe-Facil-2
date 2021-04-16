import { defaultForm, fieldsetFormElement } from "../form-base"

export function renderizarCliente(data: {dest: any}): string {
    return /*html*/ `
    <div>${data.dest.xNome}
    <i>${data.dest.enderDest.xLgr}</i></div>`
}

export function gerarViewCliente() {
    const views = defaultForm.generateView(
        defaultForm.elementosNFe[3],
        { customRequireds: ['dest', 'xNome', 'enderDest'] })
    const view = views[0] as fieldsetFormElement
    return view
}