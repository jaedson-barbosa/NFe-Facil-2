import { defaultForm, defaultFormSubmit, IBaseFormElement, fieldsetFormElement, createId } from './form-base'
import { entries, set, sync } from './db'
import { gerarViewCliente, renderizarCliente } from './dados/clientes'
import { gerarViewProduto, renderizarProduto } from './dados/produtos'
import { gerarViewMotorista, renderizarMotorista } from './dados/motoristas'

function main(
    tipoDado: 'dest' | 'prod' | 'transporta',
    renderizarItem: (data: any) => HTMLButtonElement,
    ...view: IBaseFormElement[]) {
    const mainDialog = document.querySelector('dialog')
    mainDialog.showModal()
    const dados = document.getElementById('dados')
    const form = new defaultForm()
    form.elements.push(...view)

    const cadastrar = (v?: [IDBValidKey, any, HTMLElement]) => {
        mainDialog.showModal()
        mainDialog.innerHTML = ''
        if (v?.[1]) form.updateValue(v?.[1])
        else form.resetValue()
        const htmlForm = form.generateForm()
        mainDialog.appendChild(htmlForm)
        htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
            const id = v?.[0] ?? createId()
            await set(id, data)
            if (v?.[2]) {
                renderizarNovoItem([id, data], v?.[2])
                v?.[2].remove()
            } else renderizarNovoItem([id, data])
            mainDialog.close()
        })
    }

    async function renderizarItens() {
        dados.innerHTML = ''
        const totalItens = await entries()
        const itens = totalItens.filter(v => v[1][tipoDado])
        itens.forEach(v => renderizarNovoItem(v))
    }

    function renderizarNovoItem(v: [IDBValidKey, any], ref?: HTMLElement) {
        const button = renderizarItem(v[1])
        button.onclick = () => cadastrar([...v, button])
        if (ref) ref.before(button)
        else dados.appendChild(button)
    }

    sync().then(async () => {
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
    }).catch(() => alert('Não foi possível sincronizar.'))
}

const parametros = new URLSearchParams(location.search)
switch (parametros.get('tipo')) {
    case 'clientes':
        main('dest', renderizarCliente, ...gerarViewCliente())
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
