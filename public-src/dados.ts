import { initializeForm, createId, formTargets } from './form-base'
import { entries, set, sync } from './db'
import { renderizarCliente } from './dados/clientes'

const mainDialog = document.querySelector('dialog')!
mainDialog.showModal()
const parametros = new URLSearchParams(location.search)
const tipo = parametros.get('tipo')
let tipoDado: 'dest' = undefined
let formTarget: formTargets = undefined
let renderizarItem: (data) => HTMLButtonElement = undefined
switch (tipo) {
    case 'clientes':
        tipoDado = 'dest'
        formTarget = 'destinatario-cadastro'
        renderizarItem = renderizarCliente
        break;
    default:
        alert('URL inválido, tipo não aceito.')
        location.href = './painel.html'
        break;
}
if (tipoDado && formTarget && renderizarItem) {
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
            initializeForm(
                formTarget!, mainDialog,
                async data => {
                    await set(createId(), data)
                    renderizarNovoItem(data)
                    mainDialog.close()
                })
        }
        document.getElementById('atualizar').onclick = async () => {
            await sync()
            await renderizarItens()
        }
        mainDialog.close()
    }).catch(() => alert('Não foi possível sincronizar.'))
}