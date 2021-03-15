import { defaultForm, createId, defaultFormSubmit, IBaseFormElement } from './form-base'
// import { entries, set, sync } from './db'
import { renderizarCliente } from './dados/clientes'
import { renderizarProduto } from './dados/produtos'
import { renderizarMotorista } from './dados/motoristas'

async function sync() {
    return Promise.resolve()
}

function main(
    view: IBaseFormElement[],
    renderizarItem: (data: any) => HTMLButtonElement) {
    const mainDialog = document.querySelector('dialog')
    mainDialog.showModal()
    const dados = document.getElementById('dados')

    async function renderizarItens() {
        dados.innerHTML = ''
        // const totalItens = await entries()
        // const itens = totalItens.filter(v => v[1][tipoDado])
        // itens.forEach(v => renderizarNovoItem(v[1]))
    }

    function renderizarNovoItem(data: any) {
        dados.appendChild(renderizarItem(data))
    }

    sync().then(async () => {
        await renderizarItens()
        document.getElementById('cadastrar').onclick = () => {
            mainDialog.showModal()
            const form = new defaultForm()
            form.elements.push(...view)
            const htmlForm = form.generateForm()
            mainDialog.appendChild(htmlForm)
            htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
                // await set(createId(), data)
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

function getView(
    sourceGetter: (source: any) => any,
    customRequireds?: string[]) {
    const element = sourceGetter(defaultForm.elementosNFe)
    const view = defaultForm.generateView(element, customRequireds ?? [])
    return view
}

const parametros = new URLSearchParams(location.search)
switch (parametros.get('tipo')) {
    case 'clientes':
        main(
            getView(v => v[3], ['dest', 'xNome', 'enderDest']),
            renderizarCliente)
        break
    case 'produtos':
        // Este terá que ser personalizado, a área de produtos é caótica demais pra usar apenas a geração automática
        main(
            getView(v => v[7]['complexType']['sequence']['element'][0]),
            renderizarProduto)
        break
    case 'motoristas':
        main(
            getView(v => v[9]['complexType']['sequence']['element'][1]),
            renderizarMotorista)
        break
    default:
        alert('URL inválido, tipo não aceito.')
        location.href = './painel.html'
        break
}
