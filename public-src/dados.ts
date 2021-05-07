import {
  IBaseFormElement,
  clearChildren,
  generateForm
} from './form-base'
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
import { registrarDado } from './functions'

function main(tDado: TNota, render: (data: any) => string): void
function main(
  tDado: TDadosBase,
  render: (data: any) => string,
  view: IBaseFormElement
): void
function main(
  tDado: TDados,
  render: (data: any) => string,
  view?: IBaseFormElement
): void {
  const mainDialog = document.querySelector('dialog')
  mainDialog.showModal()
  const dados = document.getElementById('dados')
  function cadastrar(item?: {id: IDBValidKey, data: any, button: HTMLButtonElement}) {
    mainDialog.showModal()
    clearChildren(mainDialog)
    if (tDado == 'infNFe' && item) {
      const genButton = (label: string, action: () => void) => {
        const btn = document.createElement('button')
        btn.textContent = label
        btn.onclick = action
        mainDialog.appendChild(btn)
      }
      if (item.data.infNFe.Id) {
        console.log(item.data)
        const clonar = document.createElement('a')
        clonar.textContent = 'Clonar nota'
        clonar.href = './nfe.html?c=' + item.id
        mainDialog.appendChild(clonar)
      } else {
        const editar = document.createElement('a')
        editar.textContent = "Editar nota"
        editar.href = './nfe.html?e=' + item.id
        mainDialog.appendChild(editar)
      }
      genButton('Gerar DANFE', () => baixarDANFE(item.id as string))
      genButton('Baixar XML', () => baixarXML(item.id as string))
    } else if (tDado != 'infNFe' && view) {
      if (item?.data) view.updateValue(item.data)
      else view.resetValue()
      mainDialog.appendChild(generateForm(async (data) => {
        if (await registrarDado(data, item?.id as string)) {
          location.reload()
        }
      }, view))
    } else {
      mainDialog.close()
      alert("Método não implementado")
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
    button.onclick = () => cadastrar({id: v[0], data: v[1], button})
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
    main('transporta', renderizarMotorista, gerarViewMotorista())
    break
  case 'notas':
    main('infNFe', renderizarNota)
    break
  default:
    alert('URL inválido, tipo não aceito.')
    location.href = './painel.html'
    break
}
