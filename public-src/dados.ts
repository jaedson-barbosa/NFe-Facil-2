import {
  defaultForm,
  IBaseFormElement,
  createId,
  clearChildren,
} from './form-base'
import { set, sync } from './db'
import { gerarViewCliente, renderizarCliente } from './dados/clientes'
import { gerarViewProduto, renderizarProduto } from './dados/produtos'
import { gerarViewMotorista, renderizarMotorista } from './dados/motoristas'
import { getItens } from './dados/geral'

const mainDialog = document.querySelector('dialog')

function main(
  tipoDado: 'dest' | 'prod' | 'transporta',
  renderizarItem: (data: any) => string,
  ...view: IBaseFormElement[]
) {
  mainDialog.showModal()
  const dados = document.getElementById('dados')
  const form = new defaultForm()
  form.elements.push(...view)

  const cadastrar = (v?: [IDBValidKey, any, HTMLElement]) => {
    mainDialog.showModal()
    clearChildren(mainDialog)
    if (v?.[1]) form.updateValue(v?.[1])
    else form.resetValue()
    const htmlForm = form.generateForm(async (data) => {
      const id = v?.[0] ?? createId()
      await set(id, data)
      if (v?.[2]) {
        renderizarNovoItem([id, data], v?.[2])
        v?.[2].remove()
      } else renderizarNovoItem([id, data])
      mainDialog.close()
    })
    mainDialog.appendChild(htmlForm)
  }

  async function renderizarItens() {
    dados.innerHTML = ''
    const itens = await getItens(tipoDado)
    itens.forEach((v) => renderizarNovoItem(v))
  }

  function renderizarNovoItem(v: [IDBValidKey, any], ref?: HTMLElement) {
    const button = document.createElement('button')
    button.innerHTML = renderizarItem(v[1])
    button.onclick = () => cadastrar([...v, button])
    if (ref) ref.before(button)
    else dados.appendChild(button)
  }

  sync()
    .then(async () => {
      await renderizarItens()
      document.getElementById('cadastrar').onclick = () => cadastrar()
      document.getElementById('atualizar').onclick = async () => {
        mainDialog.innerHTML = 'Carregando'
        mainDialog.showModal()
        await sync()
        await renderizarItens()
        mainDialog.close()
      }
      mainDialog.close()
    })
    .catch(() => alert('Não foi possível sincronizar.'))
}

const parametros = new URLSearchParams(location.search)
switch (parametros.get('tipo')) {
  case 'clientes':
    main('dest', renderizarCliente, gerarViewCliente())
    break
  case 'produtos':
    main('prod', renderizarProduto, gerarViewProduto())
    break
  case 'motoristas':
    main('transporta', renderizarMotorista, ...gerarViewMotorista())
    break
  default:
    alert('URL inválido, tipo não aceito.')
    location.href = './painel.html'
    break
}
