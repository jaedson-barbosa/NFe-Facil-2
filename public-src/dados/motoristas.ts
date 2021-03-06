export function renderizarMotorista(data: {transporta: any}): HTMLButtonElement {
    const div = document.createElement('button')
    div.innerHTML = /*html*/ `
    <div>${data.transporta.xNome}
    <i>${data.transporta.xEnder}</i></div>`
    return div
}