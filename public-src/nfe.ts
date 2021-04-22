import { gerarViewCliente } from './dados/clientes'
import { getItens } from './dados/geral'
import {
    defaultForm,
    fieldsetFormElement,
    hiddenFormElement,
    getCodigoEstado,
    getRandomNumber,
    listFormElement,
    searchFormElement,
    IBaseFormElement,
    clean,
    buttonFormElement
} from './form-base'
import { getAmbiente, getEmpresaAtiva, versaoEmissor } from './sessao'

const empresa = getEmpresaAtiva()
const emit = empresa.emit

declare global {
    interface Date {
        toNFeString(): string;
    }
}

Date.prototype.toNFeString = function () {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function (num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}

function gerarIdentificacao() {
    const root = defaultForm.elementosNFe[0]
    const rootName = 'ide'
    const NFref = defaultForm.generateViews(root, {}, 'NFref')[0]
    return new fieldsetFormElement(
        { legend: 'Informações de identificação da NF-e', required: true },
        new hiddenFormElement([rootName, 'cUF'], true, getCodigoEstado(emit.enderEmit.UF)),
        new hiddenFormElement([rootName, 'cNF'], true, getRandomNumber().toString()),
        ...defaultForm.generateViews(root, {}, 'natOp'),
        new hiddenFormElement([rootName, 'mod'], true, '55'),
        new hiddenFormElement([rootName, 'serie'], true, empresa.serieAtual.toString()),
        new hiddenFormElement([rootName, 'nNF'], true, '%NUMERO%'),
        new hiddenFormElement([rootName, 'dhEmi'], true, new Date().toNFeString()),
        ...defaultForm.generateViews(root, {}, 'tpNF', 'idDest', 'cMunFG'),
        new hiddenFormElement([rootName, 'tpImp'], true, '1'),
        new hiddenFormElement([rootName, 'tpEmis'], true, '1'),
        new hiddenFormElement([rootName, 'cDV'], true, '%CDV%'),
        new hiddenFormElement([rootName, 'tpAmb'], true, getAmbiente()),
        ...defaultForm.generateViews(root, {}, 'finNFe', 'indFinal', 'indPres', 'indIntermed'),
        new hiddenFormElement([rootName, 'procEmi'], true, '0'),
        new hiddenFormElement([rootName, 'verProc'], true, versaoEmissor()),
        new listFormElement(NFref as fieldsetFormElement, ['ide', 'NFref']))
}

function gerarEmitente() {
    const view = defaultForm.generateView(
        defaultForm.elementosNFe[1],
        { rootTag: 'element' })[0] as fieldsetFormElement
    view.options.hidden = true
    view.updateValue({ emit })
    return view
}

const dialog = document.getElementById('search') as HTMLDialogElement

async function gerarProdutosEdicao() {
    const views = defaultForm.generateView(
        defaultForm.elementosNFe[7],
        {
            customRequireds: ['IPI|ISSQN', 'ICMS|IPI|II'],
            customOptions: [
                {
                    firstOption: 'Tributação pelo ICMS\n00 - Tributada integralmente',
                    optionsChanger: options => {
                        if (emit.CRT === 2) {
                            // Regime normal
                            options.splice(11)
                        } else {
                            // Simples nacional
                            options.splice(0, 11)
                        }
                    }
                }
            ]
        })
    const view = views[0] as listFormElement
    const prods = await getItens('prod')
    const prodsView = prods.map(v => {
        const cProd = v[1].prod.cProd
        const xProd = v[1].prod.xProd
        return cProd ? `${xProd} - ${cProd}` : xProd
    })
    let i = 0
    view.onAddItem = content => {
        const localI = i++
        const search = new searchFormElement(
            'Buscar produto cadastrado',
            prodsView,
            value => {
                const index = prodsView.indexOf(value)
                const prod = prods[index][1]
                const det = { det: {} }
                det.det[localI] = prod
                content.forEach(v => v.updateValue(det))
                dialog.close()
            }
        )
        const button = new buttonFormElement(
            'Buscar produto cadastrado',
            () => {
                clean(dialog)
                search.generate(dialog)
                dialog.showModal()
            }
        )
        content.unshift(button)
    }
    return view
}

async function gerarCliente() {
    const view = gerarViewCliente()
    const content = view.children
    const dests = await getItens('dest')
    const destsView = dests.map(v => {
        const xNome = v[1].dest.xNome
        const xLgr = v[1].dest.enderDest.xLgr
        return xLgr ? `${xNome} - ${xLgr}` : xNome
    })
    console.log(destsView)
    const search = new searchFormElement(
        'Buscar cliente cadastrado',
        destsView,
        value => {
            const index = destsView.indexOf(value)
            const dest = dests[index][1]
            content.forEach(v => v.updateValue(dest))
            dialog.close()
        }
    )
    const button = new buttonFormElement(
        'Buscar cliente cadastrado',
        () => {
            clean(dialog)
            search.generate(dialog)
            dialog.showModal()
        }
    )
    content.unshift(button)
    return view
}

function gerarProdutosVisualizacao() {
    const views = defaultForm.generateView(
        defaultForm.elementosNFe[7],
        { customRequireds: ['IPI|ISSQN', 'ICMS|IPI|II'] }
    )
    const view = views[0] as listFormElement
    view.hidden = true
    return view
}

function gerarRetirada() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[4],
        { rootTag: 'element' })
}

function gerarEntrega() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[5],
        { rootTag: 'element' })
}

function gerarAutorizacao() {
    return new listFormElement(
        defaultForm.generateView(
            defaultForm.elementosNFe[6]
        )[0] as fieldsetFormElement,
        ['autXML'])
}

async function gerarTransporte() {
    const views = defaultForm.generateView(
        defaultForm.elementosNFe[9],
        {
            rootTag: 'element',
            customRequireds: ['vol', 'veicTransp|reboque', 'reboque', 'lacres']
        })
    const view = views[0] as fieldsetFormElement
    const motView = view.children[1] as fieldsetFormElement
    const content = motView.children
    const mots = await getItens('transporta')
    const motsView = mots.map(v => {
        const xNome = v[1].transporta.xNome
        const xEnder = v[1].transporta.xEnder
        return xEnder ? `${xNome} - ${xEnder}` : xNome
    })
    const search = new searchFormElement(
        'Buscar motorista cadastrado',
        motsView,
        value => {
            const index = motsView.indexOf(value)
            const mot = mots[index][1]
            const transp = { transp: mot }
            content.forEach(v => v.updateValue(transp))
            dialog.close()
        }
    )
    const button = new buttonFormElement(
        'Buscar motorista cadastrado',
        () => {
            clean(dialog)
            search.generate(dialog)
            dialog.showModal()
        }
    )
    content.unshift(button)
    return view
}

function gerarCobranca() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[10],
        {
            rootTag: 'element',
            customRequireds: ['fat', 'dup']
        })
}

function gerarPagamento() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[11],
        { rootTag: 'element' })
}

function gerarIntermediador() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[12],
        { rootTag: 'element' })
}

function gerarInformacoes() {
    return new fieldsetFormElement(
        { legend: 'Informações Adicionais', required: false },
        ...defaultForm.generateViews(
            defaultForm.elementosNFe[13],
            {}, 'infAdFisco', 'infCpl'))
}

function gerarExportacao() {
    return defaultForm.generateView(defaultForm.elementosNFe[14])
}

function gerarCompra() {
    return defaultForm.generateView(defaultForm.elementosNFe[15])
}

function gerarCana() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[16],
        { customRequireds: ['deduc'] })
}

function gerarResponsavelTecnico() {
    const rootName = 'infRespTec'
    return new fieldsetFormElement(
        { legend: 'Responsável técnico', required: true, hidden: true },
        new hiddenFormElement([rootName, 'CNPJ'], true, '12931158000164'),
        new hiddenFormElement([rootName, 'xContato'], true, 'Jaedson Barbosa Serafim'),
        new hiddenFormElement([rootName, 'email'], true, 'jaedson33@gmail.com'),
        new hiddenFormElement([rootName, 'fone'], true, '83988856440'))
}

const main = document.getElementById('main')
const form = new defaultForm()

let telaPrincipal: IBaseFormElement[]
let telaProdutos: listFormElement
let tela: 'produtos' | 'principal' = 'produtos'
let currentData: any = {}

async function renderizarTela() {
    clean(main)
    switch (tela) {
        case 'principal':
            if (!telaPrincipal) telaPrincipal = [
                gerarIdentificacao(),
                gerarEmitente(),
                await gerarCliente(),
                gerarProdutosVisualizacao(),
                ...gerarRetirada(),
                ...gerarEntrega(),
                gerarAutorizacao(),
                await gerarTransporte(),
                ...gerarCobranca(),
                ...gerarPagamento(),
                ...gerarIntermediador(),
                gerarInformacoes(),
                ...gerarExportacao(),
                ...gerarCompra(),
                ...gerarCana(),
                gerarResponsavelTecnico()
            ]
            form.elements = telaPrincipal
            form.updateValue(currentData)
            main.appendChild(form.generateForm(data => {
                currentData = data
                console.log(data)
            }))
            break;
        case 'produtos':
            if (!telaProdutos) telaProdutos = await gerarProdutosEdicao()
            form.elements = [telaProdutos]
            main.appendChild(form.generateForm(data => {
                currentData.det = data.det
                tela = 'principal'
                renderizarTela()
            }))
            break
        default:
            break;
    }
}
renderizarTela()