import { defaultForm, findField, defaultFormSubmit, IBaseFormElement, fieldsetFormElement } from './form-base'

const main = document.getElementById('main')
const form = new defaultForm()
const view = defaultForm.generateView(defaultForm.elementosNFe, ['dest', 'xNome', 'enderDest'])
form.elements.push(...view)
const htmlForm = form.generateForm()
main.appendChild(htmlForm)
htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
    console.log(data)
})