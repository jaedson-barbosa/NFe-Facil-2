import { defaultForm, defaultFormSubmit, IBaseFormElement, fieldsetFormElement, createId } from './form-base'
import { entries, set, sync } from './db'
import { renderizarCliente } from './dados/clientes'
import { renderizarProduto } from './dados/produtos'
import { renderizarMotorista } from './dados/motoristas'

function main(
    tipoDado: 'dest' | 'prod' | 'transporta',
    renderizarItem: (data: any) => HTMLButtonElement,
    ...view: IBaseFormElement[]) {
    const mainDialog = document.querySelector('dialog')
    mainDialog.showModal()
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
            const form = new defaultForm()
            form.elements.push(...view)
            const htmlForm = form.generateForm()
            mainDialog.appendChild(htmlForm)
            htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
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

const parametros = new URLSearchParams(location.search)
switch (parametros.get('tipo')) {
    case 'clientes':
        main(
            'dest',
            renderizarCliente,
            ...defaultForm.generateView(
                defaultForm.elementosNFe[3],
                ['dest', 'xNome', 'enderDest']))
        break
    case 'produtos':
        main(
            'prod',
            renderizarProduto,
            new fieldsetFormElement(
                'Dados dos produtos e serviços',
                ...defaultForm.generateViews(
                    defaultForm.elementosNFe[7]['complexType']['sequence']['element'][0],
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
                    'CEST')))
        break
    case 'motoristas':
        main(
            'transporta',
            renderizarMotorista,
            ...defaultForm.generateView(
                defaultForm.elementosNFe[9]['complexType']['sequence']['element'][1],
                []))
        break
    default:
        alert('URL inválido, tipo não aceito.')
        location.href = './painel.html'
        break
}
