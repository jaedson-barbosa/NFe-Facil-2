import * as basicSchema from './base-data/basic.json'
import * as nfeSchema from './base-data/nfe.json'
import { IBGE } from './base-data/IBGE.json'

interface IType {
    _attributes: { name: string }
    annotation?: { documentation: { _text: string } }
}

interface IComplexType extends IType {
    sequence: { element: any[] }
}

const complexTypes: IComplexType[] = nfeSchema.schema.complexType
const simpleTypes: IType[] = basicSchema.schema.simpleType

const customHeaders = [
    {name: 'fone', header: 'Telefone'}
]

function createId() { return Math.random().toString(36).substr(2, 9) }
function createView(parentView: HTMLElement, field: any, parentTags: string[], tag: string = ''): void {
    const getDocumentation = (v: any): string => v.annotation.documentation._text
    const updateInput = (v: any, input?: HTMLElement): HTMLElement => {
        const fieldRestriction = v.simpleType?.restriction
        const baseType = v._attributes?.type ?? fieldRestriction?._attributes.base
        const hasOtherRestrictions = baseType != 'string'
        const findFunc = k => k._attributes.name == baseType
        if (hasOtherRestrictions && !simpleTypes.some(findFunc)) {
            const complexType = complexTypes.find(findFunc)
            if (!complexType) throw new DOMException('Invalid field')
            createView(parentView, { ...v, complexType: { sequence: complexType.sequence } }, parentTags)
        } else {
            const otherRestrictions: any = hasOtherRestrictions ? (simpleTypes.find(findFunc) as any)?.restriction : undefined
            if (hasOtherRestrictions && otherRestrictions._attributes.base != 'string') {
                console.log(otherRestrictions)
                throw new DOMException('The other restrictions have a invalid base.')
            }
            const enumeration = fieldRestriction?.enumeration ?? otherRestrictions?.enumeration
            if (!input) {
                input = document.createElement(enumeration ? 'select' : 'input')
            }
            if (enumeration) {
                const select = input as HTMLSelectElement
                select.name = [...parentTags, v._attributes.name].join('.')
                select.required = (v._attributes?.minOccurs ?? 1) > 0
                const documentation = getDocumentation(v)
                const lines = documentation.split('\n')
                if ('length' in enumeration) {
                    if (enumeration.length == 2 && enumeration[0]._attributes.value.toUpperCase() == enumeration[1]._attributes.value.toUpperCase()) {
                        const onlyOption = document.createElement('option')
                        onlyOption.innerText = enumeration[0]._attributes.value
                        select.appendChild(onlyOption)
                        select.style.display = 'none'
                    } else if (enumeration.length > 2) {
                        const values = (enumeration as any[]).map(v => v._attributes.value)
                        const hasDescriptions = values.every(v => lines.some(l => l.includes(v + ' – ')))
                        select.innerHTML = values.map(v => `<option value="${v}">${hasDescriptions ? lines.find(l => l.includes(v + ' – ')) : v}</option>`).join('')
                    } else {
                        throw new DOMException('Invalid enumeration length')
                    }
                }
                else {
                    const onlyOption = document.createElement('option')
                    onlyOption.innerText = enumeration._attributes.value
                    select.appendChild(onlyOption)
                    select.style.display = 'none'
                }
                select.title = documentation
            }
            else {
                const text = input as HTMLInputElement
                text.name = [...parentTags, v._attributes.name].join('.')
                text.required = (v._attributes?.minOccurs ?? 1) > 0
                text.type = 'text'
                if (text.value) text.value = ''
                text.title = getDocumentation(v)
                text.pattern = fieldRestriction?.pattern?._attributes.value ?? otherRestrictions?.pattern?._attributes.value
                const minLength = fieldRestriction?.minLength?._attributes.value ?? otherRestrictions?.minLength?._attributes.value
                const maxLength = fieldRestriction?.maxLength?._attributes.value ?? otherRestrictions?.maxLength?._attributes.value
                text.minLength = minLength ? Number(minLength) : 0
                text.maxLength = maxLength ? Number(maxLength) : 0
            }
            return input
        }
    }
    if (!tag) {
        const content = document.createElement('fieldset')
        const legend = document.createElement('legend')
        legend.innerText = field.annotation.documentation._text
        content.appendChild(legend)
        if (field.element) {
            createView(content, field.element, [...parentTags, field._attributes.name], 'element')
        } else if (field.complexType || field.sequence) {
            const fields = field.complexType.sequence ?? field.sequence
            Object.entries(fields).forEach(v => createView(content, v[1], [...parentTags, field._attributes.name], v[0]))
        } else throw new DOMException('Invalid tag')
        parentView.appendChild(content)
    }
    if (tag == 'choice') {
        const elements = field['element'] as any[]
        const input = updateInput(elements[0])
        const select = document.createElement('select')
        select.innerHTML = elements.map((v, i) => `<option>${getDocumentation(v)}</option>`).join('')
        select.onchange = () => updateInput(elements[select.selectedIndex], input)
        parentView.appendChild(select)
        parentView.appendChild(input)
    }
    if (tag == 'element') {
        field.forEach(v => {
            const input = updateInput(v)
            if (!input) return
            const label = document.createElement('label')
            label.htmlFor = input.id = createId()
            const documentation = getDocumentation(v)
            const customHeader = customHeaders.find(v => (input as any).name.includes(v.name))?.header
            label.innerText = customHeader ?? documentation.split('\n')[0].split('.')[0].split('-')[0]
            parentView.appendChild(label)
            parentView.appendChild(input)
        })
    }
    if (tag == 'sequence') {
        const check = document.createElement('input')
        check.type = 'checkbox'
        const label = document.createElement('label')
        label.htmlFor = check.id = createId()
        label.innerText = 'Informar ' + field.annotation.documentation._text
        const activeDiv = document.createElement('div')
        check.onclick = () => {
            if (check.checked) createView(activeDiv, field, parentTags)
            else activeDiv.innerHTML = ''
        }
        parentView.appendChild(check)
        parentView.appendChild(label)
        parentView.appendChild(activeDiv)
    }
}

const preSubmit: (() => void)[] = []

function postProcess(parentView: HTMLElement) {
    const children = parentView.children
    if (children.length > 0) {
        const elements = Array(children.length).fill(null).map((_, i) => children.item(i) as HTMLElement)
        const inputs = elements.filter(
            v => v.tagName == 'INPUT' || v.tagName == 'SELECT').map(v => v as any)
        if (inputs.length > 0) {
            const cMun = inputs.find(v => v.name.includes('cMun'))
            const xMun = inputs.find(v => v.name.includes('xMun'))
            const UF = inputs.find(v => v.name.includes('UF'))
            if (cMun && xMun && UF) {
                cMun.style.display = 'none'
                xMun.style.display = 'none'
                UF.style.display = 'none'
                const munSmartSelect = document.createElement('input')
                const munLabel = document.createElement('label')
                munLabel.htmlFor = munSmartSelect.id = createId()
                munLabel.innerText = 'Município'
                const datalist = document.createElement('datalist')
                const datasource = IBGE.flatMap(
                    v => (v.Municipios as any[]).map(
                        k => `<option>${k.Nome} (${v.Sigla})</option>`))
                datalist.innerHTML = datasource.join('')
                const datalistId = createId()
                datalist.id = datalistId
                munSmartSelect.setAttribute('list', datalistId)
                preSubmit.push(() => {
                    const value = munSmartSelect.value
                    const startUF = value.indexOf('(')
                    const uf = value.substring(startUF + 1, value.length - 1)
                    const mun = value.substring(0, startUF - 1)
                    cMun.value = IBGE.find(v => v.Sigla == uf).Municipios.find(v => v.Nome == mun).Codigo
                    xMun.value = mun
                    UF.value = uf
                })
                parentView.appendChild(datalist)
                parentView.insertBefore(munSmartSelect, cMun)
                parentView.insertBefore(munLabel, munSmartSelect)
            } else if (cMun || xMun || UF) {
                throw new DOMException('One of the three address fields is present.')
            }
        }
        elements.filter(v => v.tagName == 'LABEL').map(v => v as HTMLLabelElement).forEach(v => {
            const referEl = document.getElementById(v.htmlFor)
            if (referEl.style.display == 'none') v.remove()
        })
        elements.forEach(v => postProcess(v))
    }
}

const complex = nfeSchema.schema.complexType[0].sequence.element[0]['complexType']
const emit = complex['sequence']['element'][1]
const mainForm = document.getElementsByTagName('form')[0]
createView(mainForm, emit, [])
postProcess(mainForm)

document.querySelectorAll('input[list]').forEach(input => {
    input.addEventListener('change', function () {
        const options = this.list.options
        const optionFound = [...Array(options.length)].some((_, i) => options[i].value == this.value)
        this.setCustomValidity(optionFound ? '' : 'Por favor, selecione um valor válido.');
    });
    (input as any).setCustomValidity('Selecione um valor.')
})
mainForm.onsubmit = function(e) {
    e.preventDefault()
    preSubmit.forEach(v => v())
    var object = {};
    const formData = new FormData(mainForm)
    formData.forEach(function(value, key){
        const path = key.split('.')
        const test = path.slice(0, path.length - 1).reduce((p,c) => p[c] ?? (p[c] = {}), object)
        test[path[path.length - 1]] = value;
    });
    console.log(object)
    return false
}