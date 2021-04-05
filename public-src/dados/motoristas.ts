import { defaultForm } from "../form-base"

export function renderizarMotorista(data: {transporta: any}): HTMLButtonElement {
    const div = document.createElement('button')
    div.innerHTML = /*html*/ `
    <div>${data.transporta.xNome}
    <i>${data.transporta.xEnder}</i></div>`
    return div
}

export function gerarViewMotorista() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[9]['complexType']['sequence']['element'][1],
        { customRequireds: ['transporta'] })
}