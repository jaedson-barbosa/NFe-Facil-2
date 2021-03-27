import {
    defaultForm,
    defaultFormSubmit,
    IBaseFormElement,
    fieldsetFormElement,
    hiddenFormElement,
    getCodigoEstado,
    getRandomNumber
} from './form-base'
import { getEmpresaAtiva } from './dados/emitentes'

const empresa = getEmpresaAtiva()
const emit = empresa.empresa
const main = document.getElementById('main')
const form = new defaultForm()
const reqs = []//['dest', 'xNome', 'enderDest']

function gerarIdentificacao() {
    const root = defaultForm.elementosNFe[0]
    const rootNames = ['infNFe', 'ide']
    return new fieldsetFormElement(
        'Informações de identificação da NF-e',
        new hiddenFormElement([...rootNames, 'cUF'], true, getCodigoEstado(emit.enderEmit.UF)),
        new hiddenFormElement([...rootNames, 'cNF'], true, getRandomNumber().toString()),
        ...defaultForm.generateViews(root, 'natOp'),
        new hiddenFormElement([...rootNames, 'mod'], true, '55'),
        new hiddenFormElement([...rootNames, 'serie'], true, '%SERIE%'),
        new hiddenFormElement([...rootNames, 'nNF'], true, '%NUMERO%'),

    )
}

declare global {
    interface Date {
        toNFeString(): string;
    }
}

Date.prototype.toNFeString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
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

const view = defaultForm.generateView(defaultForm.elementosNFe[0], reqs)
form.elements.push(...view)
const htmlForm = form.generateForm()
main.appendChild(htmlForm)
htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
    console.log(data)
})