import { gerarViewCliente } from './dados/clientes'
import {
    defaultForm,
    defaultFormSubmit,
    fieldsetFormElement,
    hiddenFormElement,
    getCodigoEstado,
    getRandomNumber,
    listFormElement,
    getDefaultListNameChanger,
    IBaseFormElement
} from './form-base'
import { getAmbiente, getEmpresaAtiva, versaoEmissor } from './sessao'

const empresa = getEmpresaAtiva()
const emit = empresa.empresa

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
        new hiddenFormElement([rootName, 'serie'], true, '%SERIE%'),
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

function gerarProdutosEdicao() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[7],
        { customRequireds: ['IPI|ISSQN', 'ICMS|IPI|II'] })
}

function gerarProdutosVisualizacao() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[7],
        { customRequireds: ['IPI|ISSQN', 'ICMS|IPI|II'] })
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
            defaultForm.elementosNFe[6])[0] as fieldsetFormElement,
            ['autXML'])
}

function gerarTransporte() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[9],
        {
            rootTag: 'element',
            customRequireds: ['vol', 'veicTransp|reboque', 'reboque', 'lacres']
        })
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

const telaPrincipal = [
    gerarIdentificacao(),
    gerarEmitente(),
    ...gerarViewCliente(),
    ...gerarProdutosVisualizacao(),
    ...gerarRetirada(),
    ...gerarEntrega(),
    gerarAutorizacao(),
    ...gerarTransporte(),
    ...gerarCobranca(),
    ...gerarPagamento(),
    ...gerarIntermediador(),
    gerarInformacoes(),
    ...gerarExportacao(),
    ...gerarCompra(),
    ...gerarCana(),
    gerarResponsavelTecnico()
]

const telaProdutos = gerarProdutosEdicao()

let tela: 'produtos' | 'principal' = 'produtos'
let currentData: any = {}

function renderizarTela() {
    switch (tela) {
        case 'principal':
            form.elements = telaPrincipal
            form.updateValue(currentData)
            main.appendChild(form.generateForm(data => {
                currentData = data
                console.log(data)
            }))
            break;
        case 'produtos':
            form.elements = telaProdutos
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