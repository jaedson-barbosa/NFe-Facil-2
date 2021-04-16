import { defaultForm } from "../form-base"

export function renderizarMotorista(data: {transporta: any}): string {
    return /*html*/ `
    <div>${data.transporta.xNome}
    <i>${data.transporta.xEnder}</i></div>`
}

export function gerarViewMotorista() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[9]['complexType']['sequence']['element'][1],
        { customRequireds: ['transporta'] })
}