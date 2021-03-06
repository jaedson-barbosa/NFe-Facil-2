export function renderizarProduto(data: {prod: any}): HTMLButtonElement {
    const div = document.createElement('button')
    div.innerHTML = /*html*/ `
    <div>${data.prod.xProd}
    <i>${data.prod.cProd}</i></div>`
    return div
}