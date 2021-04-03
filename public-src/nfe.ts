import {
    defaultForm,
    defaultFormSubmit,
    IBaseFormElement,
    fieldsetFormElement,
    hiddenFormElement,
    getCodigoEstado,
    getRandomNumber,
    listFormElement
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
    const rootNames = ['infNFe', 'ide']
    return new fieldsetFormElement(
        {
            legend: 'Informações de identificação da NF-e',
            required: true
        },/*
        new hiddenFormElement([...rootNames, 'cUF'], true, getCodigoEstado(emit.enderEmit.UF)),
        new hiddenFormElement([...rootNames, 'cNF'], true, getRandomNumber().toString()),
        ...defaultForm.generateViews(root, 'natOp'),
        new hiddenFormElement([...rootNames, 'mod'], true, '55'),
        new hiddenFormElement([...rootNames, 'serie'], true, '%SERIE%'),
        new hiddenFormElement([...rootNames, 'nNF'], true, '%NUMERO%'),
        new hiddenFormElement([...rootNames, 'dhEmi'], true, new Date().toNFeString()),
        ...defaultForm.generateViews(root, 'tpNF', 'idDest', 'cMunFG'),
        new hiddenFormElement([...rootNames, 'tpImp'], true, '1'),
        new hiddenFormElement([...rootNames, 'tpEmis'], true, '1'),
        new hiddenFormElement([...rootNames, 'cDV'], true, '%CDV%'),
        new hiddenFormElement([...rootNames, 'tpAmb'], true, getAmbiente()),
        ...defaultForm.generateViews(root, 'finNFe', 'indFinal', 'indPres', 'indIntermed'),
        new hiddenFormElement([...rootNames, 'procEmi'], true, '0'),
        new hiddenFormElement([...rootNames, 'verProc'], true, versaoEmissor()),*/
        new listFormElement(rootNames, root, ['NFref'], 'NFref')
    )
}

// const view = defaultForm.generateView(defaultForm.elementosNFe[0], reqs)
form.elements.push(gerarIdentificacao())
const htmlForm = form.generateForm()
main.appendChild(htmlForm)
htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
    console.log(data)
})