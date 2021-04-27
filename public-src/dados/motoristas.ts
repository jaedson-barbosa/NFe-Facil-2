import { defaultForm } from '../form-base'

export function renderizarMotorista(data: { transporta: any }): string {
  return /*html*/ `
    <div>${data.transporta.xNome}<br>
    <small><i>${data.transporta.xEnder}</i></small></div>`
}

export function gerarViewMotorista() {
  return defaultForm.generateView(
    defaultForm.elementosNFe[9]['xs:complexType']['xs:sequence']['xs:element'][1],
    { customRequireds: ['transporta', 'CPF', 'CNPJ'] }
  )
}
