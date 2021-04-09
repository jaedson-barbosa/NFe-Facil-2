import { gerarViewCliente } from './dados/clientes'
import {
    defaultForm,
    defaultFormSubmit,
    fieldsetFormElement,
    hiddenFormElement,
    getCodigoEstado,
    getRandomNumber,
    listFormElement,
    getDefaultListNameChanger
} from './form-base'
import { getAmbiente, getEmpresaAtiva, versaoEmissor } from './sessao'

const empresa = getEmpresaAtiva()
const emit = empresa.empresa
const main = document.getElementById('main')
const form = new defaultForm()
const reqs = []//['dest', 'xNome', 'enderDest']

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
    const NFrefOptions = {
        customNameChanger: getDefaultListNameChanger('NFref'),
        customRequireds: ['NFref']
    }
    const NFref = defaultForm.generateViews(root, NFrefOptions, 'NFref')[0]
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
    const root = defaultForm.elementosNFe[1]
    const views = defaultForm.generateView(root, { rootTag: 'element' })
    const view = views[0] as fieldsetFormElement
    view.options.hidden = true
    view.updateValue({ emit })
    return view
}

function gerarProdutos() {
    return defaultForm.generateView(
        defaultForm.elementosNFe[7],
        {
            customRequireds: ['IPI|ISSQN', 'ICMS|IPI|II']
        })
}

function gerarRetirada() {
    const root = defaultForm.elementosNFe[4]
    return defaultForm.generateView(root, { rootTag: 'element' })
}

function gerarEntrega() {
    const root = defaultForm.elementosNFe[5]
    return defaultForm.generateView(root, { rootTag: 'element' })
}

function gerarAutorizacao() {
    const root = defaultForm.elementosNFe[6]
    const customNameChanger = getDefaultListNameChanger('autXML')
    const options = { customNameChanger, customRequireds: ['autXML'] }
    const el = defaultForm.generateView(root, options)[0]
    return new listFormElement(el as fieldsetFormElement, ['autXML'])
}

function gerarTransporte() {
    const root = defaultForm.elementosNFe[9]
    const customRequireds = ['vol', 'veicTransp|reboque', 'reboque', 'lacres']
    const options = { rootTag: 'element', customRequireds }
    return defaultForm.generateView(root, options)
}

function gerarCobranca() {
    const root = defaultForm.elementosNFe[10]
    const customRequireds = ['fat', 'dup']
    const options = { rootTag: 'element', customRequireds }
    return defaultForm.generateView(root, options)
}

function gerarPagamento() {
    const root = defaultForm.elementosNFe[11]
    const options = { rootTag: 'element' }
    return defaultForm.generateView(root, options)
}

function gerarIntermediador() {
    const root = defaultForm.elementosNFe[12]
    const options = { rootTag: 'element' }
    return defaultForm.generateView(root, options)
}

function gerarInformacoes() {
    const root = defaultForm.elementosNFe[13]
    return new fieldsetFormElement(
        { legend: 'Informações Adicionais', required: false },
        ...defaultForm.generateViews(root, {}, 'infAdFisco', 'infCpl'))
}

function gerarExportacao() {
    const root = defaultForm.elementosNFe[14]
    return defaultForm.generateView(root)
}

function gerarCompra() {
    const root = defaultForm.elementosNFe[15]
    return defaultForm.generateView(root)
}

function gerarCana() {
    const root = defaultForm.elementosNFe[16]
    const options = { customRequireds: ['deduc'] }
    return defaultForm.generateView(root, options)
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

// const view = defaultForm.generateView(defaultForm.elementosNFe[0], reqs)
form.elements.push(gerarIdentificacao())
form.elements.push(gerarEmitente())
form.elements.push(...gerarViewCliente())
form.elements.push(...gerarProdutos())
form.elements.push(...gerarRetirada())
form.elements.push(...gerarEntrega())
form.elements.push(gerarAutorizacao())
form.elements.push(...gerarTransporte())
form.elements.push(...gerarCobranca())
form.elements.push(...gerarPagamento())
form.elements.push(...gerarIntermediador())
form.elements.push(gerarInformacoes())
form.elements.push(...gerarExportacao())
form.elements.push(...gerarCompra())
form.elements.push(...gerarCana())
form.elements.push(gerarResponsavelTecnico())
const htmlForm = form.generateForm()
main.appendChild(htmlForm)
htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
    console.log(data)
})