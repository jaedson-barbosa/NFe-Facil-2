import * as basicSchema from './base-data/basic.json'
import * as nfeSchema from './base-data/nfe.json'
import { IBGE } from './base-data/IBGE.json'
import { paises } from './base-data/paises.json'

export function getForm(index: number = 0) {
    return document.getElementsByTagName('form')[index]
}

interface IType {
    _attributes: { name: string }
    annotation?: { documentation: { _text: string } }
}

interface IComplexType extends IType {
    sequence: { element: any[] }
}

const complexTypes: IComplexType[] = nfeSchema.schema.complexType
const simpleTypes: IType[] = basicSchema.schema.simpleType

export function createId() { return Math.random().toString(36).substr(2, 9) }

export function defaultFormSubmit(e: Event, onSubmit: (data: any) => void) {
    e.preventDefault()
    var object = {};
    const formData = new FormData(e.target as HTMLFormElement)
    formData.forEach(function (value, key) {
        if (!value) return
        const path = key.split('.')
        path.slice(0, path.length - 1)
            .reduce((p, c) => p[c] ?? (p[c] = {}), object)
        [path[path.length - 1]] = value;
    });
    onSubmit(object)
    return false
}

export function initializeForm(
    customHeaders: {name: string, header: string}[],
    customRequireds: string[],
    sourceGetter: (source: any) => any,
    formParent: HTMLElement,
    additionalBody?: HTMLDivElement): HTMLFormElement {
    
    function createView(parentView: HTMLElement, field: any, parentTags: string[], tag: string = '', ignorarAnaliseOcorrencia: boolean = false): void {
        const getDocumentation = (v: any): string => v.annotation?.documentation?._text ?? 'VAZIO'
        const isRequired = (v : any): boolean => (v._attributes?.minOccurs ?? 1) > 0 || customRequireds.includes(v._attributes.name)
        const updateInput = (v: any, input?: HTMLElement): HTMLElement | undefined => {
            const fieldRestriction = v.simpleType?.restriction
            const baseType = v._attributes?.type ?? fieldRestriction?._attributes.base
            const hasOtherRestrictions = baseType != 'string'
            const findFunc = k => k._attributes.name == baseType
            if (hasOtherRestrictions && !simpleTypes.some(findFunc)) {
                const complexType = complexTypes.find(findFunc)
                if (!complexType) throw new DOMException('Invalid field')
                createView(parentView, { ...v, complexType: { sequence: complexType.sequence } }, parentTags, 'sequence')
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
                    select.required = isRequired(v)
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
                    text.required = isRequired(v)
                    text.type = 'text'
                    if (text.value) text.value = ''
                    text.title = getDocumentation(v)
                    text.pattern = fieldRestriction?.pattern?._attributes.value ?? otherRestrictions?.pattern?._attributes.value
                    const minLength = fieldRestriction?.minLength?._attributes.value ?? otherRestrictions?.minLength?._attributes.value
                    const maxLength = fieldRestriction?.maxLength?._attributes.value ?? otherRestrictions?.maxLength?._attributes.value
                    if (minLength) text.minLength = Number(minLength)
                    else text.removeAttribute('minLength')
                    if (maxLength) text.maxLength = Number(maxLength)
                    else text.removeAttribute('maxLength')
                }
                return input
            }
        }
        if (!tag) {
            if (!ignorarAnaliseOcorrencia && !isRequired(field)) {
                createView(parentView, field, parentTags, 'sequence', true)
                return
            }
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
            if (input) {
                const select = document.createElement('select')
                select.innerHTML = elements.map((v, i) => `<option>${getDocumentation(v)}</option>`).join('')
                select.onchange = () => updateInput(elements[select.selectedIndex], input)
                parentView.appendChild(select)
                parentView.appendChild(input)
            } else console.error('Entrada inválida para um choice.')
        }
        if (tag == 'element') {
            field.forEach((v: any) => {
                const input = updateInput(v)
                if (!input) return
                const label = document.createElement('label')
                label.htmlFor = input.id = createId()
                const documentation = getDocumentation(v)
                const customHeader = customHeaders.find(v => (input as any).name.includes(v.name))?.header
                label.innerText = customHeader ?? documentation.split('\n')[0].split('.')[0].split('(')[0]
                parentView.appendChild(label)
                parentView.appendChild(input)
            })
        }
        if (tag == 'sequence') {
            if (!ignorarAnaliseOcorrencia && isRequired(field)) {
                createView(parentView, field, parentTags, undefined, true)
                return
            }
            const check = document.createElement('input')
            check.type = 'checkbox'
            const label = document.createElement('label')
            label.htmlFor = check.id = createId()
            label.innerText = 'Informar ' + field.annotation.documentation._text
            const activeDiv = document.createElement('div')
            parentView.appendChild(check)
            parentView.appendChild(label)
            parentView.appendChild(activeDiv)
            check.onclick = () => {
                if (check.checked) {
                    createView(activeDiv, field, parentTags, undefined, true)
                    postProcess(activeDiv)
                }
                else activeDiv.innerHTML = ''
            }
        }
    }

    function postProcess(parentView: HTMLElement) {
        const children = parentView.children
        if (children.length > 0) {
            const elements = Array(children.length).fill(null).map((_, i) => children.item(i) as HTMLElement)
            const inputs = elements.filter(
                v => v.tagName == 'INPUT' || v.tagName == 'SELECT').map(v => v as any)
            if (inputs.length > 0) {
                const cMun = inputs.find(v => v.name.endsWith('.cMun'))
                const xMun = inputs.find(v => v.name.endsWith('.xMun'))
                const UF = inputs.find(v => v.name.endsWith('.UF'))
                if (cMun && xMun && UF) {
                    [UF, xMun, cMun].forEach(v => v.style.display = 'none')
                    const munSmartSelect = document.createElement('input')
                    const munLabel = document.createElement('label')
                    munLabel.htmlFor = munSmartSelect.id = createId()
                    munLabel.innerText = 'Município'
                    const datalist = document.createElement('datalist')
                    datalist.innerHTML = IBGE.flatMap(
                        v => (v.Municipios as any[]).map(
                            k => `<option>${k.Nome} (${v.Sigla})</option>`)).join('')
                    munSmartSelect.setAttribute('list', datalist.id = createId())
                    munSmartSelect.onchange = () => {
                        const value = munSmartSelect.value
                        const startUF = value.indexOf('(')
                        const uf = value.substring(startUF + 1, value.length - 1)
                        const mun = value.substring(0, startUF - 1)
                        const municipio = IBGE.find(v => v.Sigla == uf)?.Municipios.find(v => v.Nome == mun)
                        if (municipio) {
                            cMun.value = municipio.Codigo
                            xMun.value = municipio.Nome
                            UF.value = uf
                        } else {
                            cMun.value = undefined
                            xMun.value = undefined
                            UF.value = undefined
                        }
                    }
                    parentView.appendChild(datalist)
                    parentView.insertBefore(munSmartSelect, cMun)
                    parentView.insertBefore(munLabel, munSmartSelect)
                } else if (cMun || xMun || UF) {
                    console.log(cMun)
                    console.log(xMun)
                    console.log(UF)
                    throw new DOMException('Um dos três campos de endereço está presente.')
                }
                const cPais = inputs.find(v => v.name.endsWith('.cPais'))
                const xPais = inputs.find(v => v.name.endsWith('.xPais'))
                if (cPais && xPais && cPais.tagName == 'INPUT' && xPais.tagName == 'INPUT') {
                    [cPais, xPais].forEach(v => v.style.display = 'none')
                    const paisSmartSelect = document.createElement('input')
                    const paisLabel = document.createElement('label')
                    paisLabel.htmlFor = paisSmartSelect.id = createId()
                    paisLabel.innerText = 'País'
                    const datalist = document.createElement('datalist')
                    datalist.innerHTML = paises.map(
                            k => `<option>${k.nome}</option>`).join('')
                    paisSmartSelect.setAttribute('list', datalist.id = createId())
                    paisSmartSelect.onchange = () => {
                        try {
                            const value = paisSmartSelect.value
                            const pais = paises.find(v => v.nome == value)
                            if (pais) {
                                xPais.value = pais.nome
                                cPais.value = pais.codigo
                            } else {
                                xPais.value = undefined
                                cPais.value = undefined
                            }
                        } catch (error) {
                            // Não achou e será capturada na validação do campo.
                        }
                    }
                    parentView.appendChild(datalist)
                    parentView.insertBefore(paisSmartSelect, cPais)
                    parentView.insertBefore(paisLabel, paisSmartSelect)
                } else if ((cPais && cPais.tagName == 'INPUT') || (xPais && xPais.tagName == 'INPUT')) {
                    console.log('Um dos elementos de nação está presente.')
                }
            }
            elements.filter(v => v.tagName == 'LABEL').map(v => v as HTMLLabelElement).forEach(v => {
                const referEl = document.getElementById(v.htmlFor)
                if (referEl) {
                    if (referEl.style.display == 'none') v.remove()
                } else {
                    console.log(v.htmlFor)
                    console.log(referEl)
                }
            })
            elements.forEach(v => postProcess(v))
        }
    }

    const complex = nfeSchema.schema.complexType[0].sequence.element[0]['complexType']
    const elementosNFe = complex['sequence']['element']
    const targetSource = sourceGetter(elementosNFe);
    const form = document.createElement('form')
    formParent.appendChild(form)
    createView(form, targetSource, [])
    postProcess(form)
    if (additionalBody) form.appendChild(additionalBody)
    const submit = document.createElement('input')
    submit.type = 'submit'
    form.appendChild(submit)

    document.querySelectorAll('input[list]').forEach(input => {
        input.addEventListener('change', function () {
            const options = this.list.options
            const optionFound = [...Array(options.length)].some((_, i) => options[i].value == this.value)
            this.setCustomValidity(optionFound ? '' : 'Por favor, selecione um valor válido.');
        });
        (input as any).setCustomValidity('Selecione um valor.')
    })
    return form
}