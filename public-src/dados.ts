import { defaultForm, findField, defaultFormSubmit, IBaseFormElement, fieldsetFormElement } from './form-base'
// import { entries, set, sync } from './db'
import { renderizarCliente } from './dados/clientes'
import { renderizarProduto } from './dados/produtos'
import { renderizarMotorista } from './dados/motoristas'

async function sync() {
    return Promise.resolve()
}

function main(
    renderizarItem: (data: any) => HTMLButtonElement,
    ...view: IBaseFormElement[]) {
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
    return defaultForm.generateView(element, customRequireds ?? [])
}

const parametros = new URLSearchParams(location.search)
switch (parametros.get('tipo')) {
    case 'clientes':
        main(
            renderizarCliente,
            ...getView(v => v[3], ['dest', 'xNome', 'enderDest']))
        break
    case 'produtos': {
        // Este terá que ser personalizado, a área de produtos é caótica demais pra usar apenas a geração automática
        const rootField = defaultForm.elementosNFe[7]['complexType']['sequence']['element'][0]
        function genView(...names: string[]) {
            return names.flatMap(name => {
                const field = findField(rootField, name)
                return defaultForm.generateView(field.field, [], field.tag, field.parentNames)
            })
        }
        const fieldset = new fieldsetFormElement(
            'Dados dos produtos e serviços',
            ...genView(
                'xProd',
                'cProd',
                'cEAN',
                'EXTIPI',
                'uCom',
                'uTrib',
                'CFOP',
                'cEANTrib',
                'NCM',
                'vUnCom',
                'vUnTrib',
                'CEST'))
        main(renderizarProduto, fieldset)
        break
    }
    case 'motoristas':
        main(
            renderizarMotorista,
            ...getView(v => v[9]['complexType']['sequence']['element'][1]))
        break
    default:
        alert('URL inválido, tipo não aceito.')
        location.href = './painel.html'
        break
}
