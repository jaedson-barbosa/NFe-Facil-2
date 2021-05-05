import { elementosNFe, generateView } from '../form-base'

export function renderizarMotorista(data: { transporta: any }): string {
  return /*html*/ `
    <div>${data.transporta.xNome}<br>
    <small><i>${data.transporta.xEnder}</i></small></div>`
}

export function gerarViewMotorista() {
  return generateView(
    elementosNFe[8]['sequence']['element'][1].sequence
  )
}
