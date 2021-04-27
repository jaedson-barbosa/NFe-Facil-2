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
import { getItens, TDados, TDadosBase, TNota } from './dados/geral'
import { renderizarNota } from './dados/notas'

const mainDialog = document.querySelector('dialog')

function main(tipoDado: TNota, renderizarItem: (data: any) => string): void
function main(
  tipoDado: TDadosBase,
  renderizarItem: (data: any) => string,
  ...view: IBaseFormElement[]
): void
function main(
  tipoDado: TDados,
  renderizarItem: (data: any) => string,
  ...view: IBaseFormElement[]
): void {
  mainDialog.showModal()
  const dados = document.getElementById('dados')
  function cadastrar(v?: [IDBValidKey, any, HTMLButtonElement]) {
    mainDialog.showModal()
    clearChildren(mainDialog)
    if (tipoDado == 'infNFe') {
      const genButton = (label: string, action: () => void) => {
        const btn = document.createElement('button')
        btn.textContent = label
        btn.onclick = action
        mainDialog.appendChild(btn)
      }
      genButton('Clonar nota', () => alert('Gerar DANFE!'))
      genButton('Gerar DANFE', () => alert('Gerar DANFE!'))
      genButton('Baixar XML', () => alert('Baixar XML!'))
    } else {
      const form = new defaultForm()
      form.elements.push(...view)
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
  }

  async function renderizarItens() {
    dados.innerHTML = ''
    const itens = await getItens(tipoDado)
    itens.forEach((v) => renderizarNovoItem(v))
  }

  function renderizarNovoItem(v: [IDBValidKey, any], ref?: HTMLButtonElement) {
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
  case 'notas':
    main('infNFe', renderizarNota)
    break
  default:
    alert('URL inválido, tipo não aceito.')
    location.href = './painel.html'
    break
}
