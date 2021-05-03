import {
  IBaseFormElement,
  createId,
  clearChildren,
  generateForm
} from './form-base'
import { set } from './db'
import { gerarViewCliente, renderizarCliente } from './dados/clientes'
import { gerarViewProduto, renderizarProduto } from './dados/produtos'
import { gerarViewMotorista, renderizarMotorista } from './dados/motoristas'
import { getItens, TDados, TDadosBase, TNota } from './dados/geral'
import {
  baixarXML,
  baixarDANFE,
  renderizarNota,
} from './dados/notas'
import { getLastAlteracoes } from './sincronizacao'

function main(tDado: TNota, render: (data: any) => string): void
function main(
  tDado: TDadosBase,
  render: (data: any) => string,
  ...view: IBaseFormElement[]
): void
function main(
  tDado: TDados,
  render: (data: any) => string,
  ...view: IBaseFormElement[]
): void {
  const mainDialog = document.querySelector('dialog')
  mainDialog.showModal()
  const dados = document.getElementById('dados')
  function cadastrar(v?: [IDBValidKey, any, HTMLButtonElement]) {
    mainDialog.showModal()
    clearChildren(mainDialog)
    if (tDado == 'infNFe') {
      const genButton = (label: string, action: () => void) => {
        const btn = document.createElement('button')
        btn.textContent = label
        btn.onclick = action
        mainDialog.appendChild(btn)
      }
      const clonar = document.createElement('a')
      clonar.textContent = 'Clonar nota'
      clonar.href = './nfe.html?c=' + v[0]
      mainDialog.appendChild(clonar)
      genButton('Gerar DANFE', () => baixarDANFE(v[0] as string))
      genButton('Baixar XML', () => baixarXML(v[0] as string))
    } else {
      const htmlForm = generateForm(async (data) => {
        const id = v?.[0] ?? createId()
        await set(id, data)
        if (v?.[2]) {
          renderizarNovoItem([id, data], v?.[2])
          v?.[2].remove()
        } else renderizarNovoItem([id, data])
        mainDialog.close()
      }, ...view)
      mainDialog.appendChild(htmlForm)
    }
  }

  async function renderizarItens() {
    dados.innerHTML = ''
    const itens = await getItens(tDado)
    itens.forEach((v) => renderizarNovoItem(v))
  }

  function renderizarNovoItem(v: [IDBValidKey, any], ref?: HTMLButtonElement) {
    const button = document.createElement('button')
    button.innerHTML = render(v[1])
    button.onclick = () => cadastrar([...v, button])
    if (ref) ref.before(button)
    else dados.appendChild(button)
  }

  getLastAlteracoes()
    .then(async () => {
      await renderizarItens()
      document.getElementById('cadastrar').onclick = () => cadastrar()
      document.getElementById('atualizar').onclick = async () => {
        mainDialog.innerHTML = 'Carregando'
        mainDialog.showModal()
        await getLastAlteracoes()
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
