import { elementosNFe, generateViews, fieldsetFormElement } from '../form-base'

export function renderizarProduto(data: { prod: any }): string {
  return /*html*/ `
    <div>${data.prod.xProd}<br>
    <small><i>${data.prod.cProd}</i></small></div>`
}

export function gerarViewProduto() {
  return new fieldsetFormElement(
    {
      legend: {label: 'Dados dos produtos e serviços' },
      required: true,
    },
    ...generateViews(
      elementosNFe[6]['element'][1],
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
      'vUnTrib'
    )
  )
}
