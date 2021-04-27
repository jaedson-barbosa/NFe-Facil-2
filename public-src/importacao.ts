import { renderizarCliente } from './dados/clientes'
import { renderizarMotorista } from './dados/motoristas'
import { renderizarNota } from './dados/notas'
import { renderizarProduto } from './dados/produtos'
import { set, setMany } from './db'
import { getForm } from './form-base'
import { importar } from './functions'

let xmls: string[]

// Como temos multiplos arquivos, não dá pra usar o metodo tradicional
document.getElementById('xmls').onchange = async (event) => {
  if (!event) return
  xmls = await Promise.all(
    Array.from((event.target as any).files as FileList).map((v) => v.text())
  )
}

//Salvar retorno da importação e exibir informações na interface (sem estilização por enquanto)
const form = getForm(0)
form.onsubmit = async (e) => {
  e.preventDefault()
  form.remove()
  const resp = await importar(xmls)
  await setMany(resp.clientes.map((v) => [v.id, v.data]))
  await setMany(resp.produtos.map((v) => [v.id, v.data]))
  await setMany(resp.motoristas.map((v) => [v.id, v.data]))
  await setMany(resp.notas.map((v) => [v.id, { infNFe: v.data }]))
  document.body.innerHTML = /*html*/ `
  <h1>Resultado da importação</h1>
  <h2>Notas fiscais importadas</h2>
  ${resp.notas.map((v) => renderizarNota({ infNFe: v.data })).join('')}
  <h2>Clientes importados</h2>
  ${resp.clientes.map((v) => renderizarCliente(v.data)).join('')}
  <h2>Produtos importados</h2>
  ${resp.produtos.map((v) => renderizarProduto(v.data)).join('')}
  <h2>Motoristas importados</h2>
  ${resp.motoristas.map((v) => renderizarMotorista(v.data)).join('')}
  <a href="./painel.html">Continuar</a>`
}
