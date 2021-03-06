import { initializeForm, createId, defaultFormSubmit } from './form-base'
import { entries, set, sync } from './db'
import { renderizarCliente } from './dados/clientes'
import { renderizarProduto } from './dados/produtos'

const mainDialog = document.querySelector('dialog')!
mainDialog.showModal()
const parametros = new URLSearchParams(location.search)
const tipo = parametros.get('tipo')
let tipoDado: 'dest' | 'prod' = undefined
let customHeaders: {name: string, header: string}[] = undefined
let customRequireds: string[] = undefined
let sourceGetter: (source: any) => any = undefined
let renderizarItem: (data: any) => HTMLButtonElement = undefined
switch (tipo) {
    case 'clientes':
        tipoDado = 'dest'
        customHeaders = [{ name: 'fone', header: 'Telefone' }]
        customRequireds = ['dest', 'xNome', 'enderDest']
        sourceGetter = v => v[3]
        renderizarItem = renderizarCliente
        break;
    case 'produtos':
        tipoDado = 'prod'
        customHeaders = []
        customRequireds = []
        sourceGetter = v => v[7]['complexType']['sequence']['element'][0]
        renderizarItem = renderizarProduto
        break
    default:
        alert('URL inválido, tipo não aceito.')
        location.href = './painel.html'
        break;
}
if (tipoDado && customHeaders && customRequireds && sourceGetter && renderizarItem) {
    const dados = document.getElementById('dados')

    async function renderizarItens() {
        dados.innerHTML = ''
        const totalItens = await entries()
        const itens = totalItens.filter(v => v[1][tipoDado])
        itens.forEach(v => renderizarNovoItem(v[1]))
    }

    function renderizarNovoItem(data: any) {
        dados.appendChild(renderizarItem(data))
    }

    sync().then(async () => {
        await renderizarItens()
        document.getElementById('cadastrar').onclick = () => {
            mainDialog.showModal()
            const form = initializeForm(
                customHeaders, customRequireds,
                sourceGetter, mainDialog)
            form.onsubmit = e => defaultFormSubmit(e, async data => {
                await set(createId(), data)
                renderizarNovoItem(data)
                mainDialog.close()
            })
        }
        document.getElementById('atualizar').onclick = async () => {
            mainDialog.innerHTML = 'Carregando'
            mainDialog.showModal()
            await sync()
            await renderizarItens()
            mainDialog.close()
        }
        mainDialog.close()
    }).catch(() => alert('Não foi possível sincronizar.'))
}