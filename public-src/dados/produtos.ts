import { defaultForm, fieldsetFormElement } from "../form-base"

export function renderizarProduto(data: {prod: any}): string {
    return /*html*/ `
    <div>${data.prod.xProd}
    <i>${data.prod.cProd}</i></div>`
}

export function gerarViewProduto() {
    return new fieldsetFormElement(
        {
            legend: 'Dados dos produtos e serviços',
            required: true
        },
        ...defaultForm.generateViews(
            defaultForm.elementosNFe[7]['xs:complexType']['xs:sequence']['xs:element'][0],
            {},
            'xProd',
            'cProd',
            'cEAN',
            'EXTIPI',
            'uCom',
            'uTrib',
            'CFOP',
            'cEANTrib',
            'NCM',
            'vUnCom',
            'vUnTrib'))
}