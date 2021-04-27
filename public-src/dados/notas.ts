export function renderizarNota(data: { ide: any, dest: any }): string {
  return /*html*/ `
    <div>${data.dest.xNome}<br>
    <small><i>${new Date(data.ide.dhEmi).toLocaleString()}</i></small></div>`
}