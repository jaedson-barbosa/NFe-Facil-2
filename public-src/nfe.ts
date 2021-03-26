import { defaultForm, defaultFormSubmit, IBaseFormElement, fieldsetFormElement } from './form-base'
import { getEmpresaAtiva } from './dados/emitentes'

const empresa = getEmpresaAtiva()
const emit = empresa.empresa
const main = document.getElementById('main')
const form = new defaultForm()
const reqs = []//['dest', 'xNome', 'enderDest']
const view = defaultForm.generateView(defaultForm.elementosNFe[0], reqs)
form.elements.push(...view)
const htmlForm = form.generateForm()
main.appendChild(htmlForm)
htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
    console.log(data)
})