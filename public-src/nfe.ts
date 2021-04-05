import { gerarViewCliente } from './dados/clientes'
import {
    defaultForm,
    defaultFormSubmit,
    IBaseFormElement,
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
    const customNameChanger = getDefaultListNameChanger('NFref')
    const NFrefOptions = { customNameChanger, customRequireds: ['NFref'] }
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
        new listFormElement(NFref as fieldsetFormElement)
    )
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
    const elOptions = { customNameChanger, customRequireds: ['autXML'] }
    const el = defaultForm.generateView(root, elOptions)[0]
    return new listFormElement(el as fieldsetFormElement)
}

function gerarTransporte() {
    const root = defaultForm.elementosNFe[9]
    const customRequireds = ['veicTransp|reboque', 'reboque']
    const options = { rootTag: 'element', customRequireds }
    return defaultForm.generateView(root, options)
}

//Produtos ficam pro final, por enquanto vamos continuar em transporte (página 60) 

// const view = defaultForm.generateView(defaultForm.elementosNFe[0], reqs)
// form.elements.push(gerarIdentificacao())
// form.elements.push(...gerarViewCliente())
// form.elements.push(...gerarRetirada())
// form.elements.push(...gerarEntrega())
// form.elements.push(gerarAutorizacao())
form.elements.push(...gerarTransporte())
const htmlForm = form.generateForm()
main.appendChild(htmlForm)
htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
    // Sera necessario fazer mais que isso para garantir a ordem
    // Pode ser gerado um novo objeto com os elementos
    // Ou alterar direto na string do json
    data.emit = emit
    console.log(data)
})