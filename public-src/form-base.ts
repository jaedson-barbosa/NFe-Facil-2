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
const simpleTypes: IType[] = [...basicSchema.schema.simpleType, ...nfeSchema.schema.simpleType]

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

const customHeaders: { name: string, header: string }[] = [
    { name: 'fone', header: 'Telefone' },
    { name: 'CFOP', header: 'Código Fiscal de Operações e Prestações - CFOP' }
]

export interface IBaseFormElement {
    generate: (parent: HTMLElement) => void
}

export class genericFormElement implements IBaseFormElement {
    private element: HTMLElement

    constructor(el: HTMLElement) {
        this.element = el
    }

    public generate(parent: HTMLElement) {
        parent.appendChild(this.element)
    }
}

abstract class inputFormElement implements IBaseFormElement {
    protected name: string[]
    protected documentation: string
    public required: boolean

    constructor(name: string[], documentation: string, required: boolean) {
        this.name = name
        this.documentation = documentation
        this.required = required
    }

    public abstract generate(parent: HTMLElement): void;

    protected updateBaseProps(input: HTMLSelectElement | HTMLInputElement) {
        input.name = this.name.join('.')
        input.title = this.documentation
        input.required = this.required
    }

    protected insertLabel(input: HTMLSelectElement | HTMLInputElement) {
        const label = document.createElement('label')
        label.htmlFor = input.id = createId()
        const customHeader = customHeaders.find(v => (input as any).name.includes(v.name))?.header
        label.innerText = customHeader ?? this.documentation.split('\n')[0].split('.')[0].split('(')[0]
        input.parentElement.insertBefore(label, input)
    }
}

export class selectFormElement extends inputFormElement {
    private options: { value: string, text: string }[]

    constructor(
        name: string[],
        documentation: string,
        required: boolean,
        options: { value: string, text: string }[]) {
        super(name, documentation, required)
        this.options = options
    }

    public generate(parent: HTMLElement) {
        const select = document.createElement('select')
        const options = this.options.map(v => `<option value="${v.value}">${v.text}</option>`)
        select.innerHTML = options.join('')
        this.updateBaseProps(select)
        parent.appendChild(select)
        this.insertLabel(select)
    }
}

export class textFormElement extends inputFormElement {
    private options: {
        pattern?: string,
        minLength?: number,
        maxLength?: number
    }

    constructor(
        name: string[],
        documentation: string,
        required: boolean,
        options: {
            pattern?: string,
            minLength?: number,
            maxLength?: number
        }) {
        super(name, documentation, required)
        this.options = options
    }

    public generate(parent: HTMLElement) {
        const text = document.createElement('input')
        text.type = 'text'
        if (this.options.pattern) text.pattern = this.options.pattern
        if (this.options.minLength) text.minLength = this.options.minLength
        if (this.options.maxLength) text.maxLength = this.options.maxLength
        this.updateBaseProps(text)
        parent.appendChild(text)
        this.insertLabel(text)
    }
}

export class selectTextFormElement extends inputFormElement {
    private options: { value: string, helpText?: string }[]
    private onChange: (value: string) => void

    constructor(
        name: string[],
        documentation: string,
        required: boolean,
        options: { value: string, helpText?: string }[],
        onChange: (value: string) => void) {
        super(name, documentation, required)
        this.options = options
        this.onChange = onChange
    }

    public generate(parent: HTMLElement) {
        const munSmartSelect = document.createElement('input')
        munSmartSelect.title = this.documentation
        const datalist = document.createElement('datalist')
        datalist.innerHTML = this.options.map(
            k => `<option>${k.value}</option>`).join('')
        munSmartSelect.setAttribute('list', datalist.id = createId())
        munSmartSelect.onchange = () => this.onChange(munSmartSelect.value)
        parent.appendChild(datalist)
        parent.appendChild(munSmartSelect)
        this.insertLabel(munSmartSelect)
        munSmartSelect.onchange = () => {
            const isValid = this.options.some(v => v.value == munSmartSelect.value)
            const validity = isValid ? '' : 'Por favor, selecione um valor válido.'
            munSmartSelect.setCustomValidity(validity)
        }
        munSmartSelect.setCustomValidity('Selecione um valor.')
    }
}

export class hiddenFormElement extends inputFormElement {
    public value: string

    constructor(
        name: string[],
        required: boolean,
        value?: string) {
        super(name, '', required)
        this.value = value
    }

    public generate(parent: HTMLElement) {
        const hidden = document.createElement('input')
        hidden.type = 'hidden'
        hidden.value = this.value
        this.updateBaseProps(hidden)
        parent.appendChild(hidden)
    }
}

export class fieldsetFormElement implements IBaseFormElement {
    private legend: string
    private children: IBaseFormElement[]

    constructor(legend?: string, ...children: IBaseFormElement[]) {
        this.children = children
        this.legend = legend
    }

    public generate(parent: HTMLElement) {
        const content = document.createElement('fieldset')
        if (this.legend) {
            const legend = document.createElement('legend')
            legend.innerText = this.legend
            content.appendChild(legend)
        }
        this.children.forEach(v => v.generate(content))
        parent.appendChild(content)
    }
}

export class choiceFormElement implements IBaseFormElement {
    private documentation: string
    private isRequired: boolean
    private options: string[]
    private contentGetter: (optionIndex: number) => IBaseFormElement

    constructor(
        documentation: string,
        isRequired: boolean,
        options: string[],
        contentGetter: (optionIndex: number) => IBaseFormElement) {
        if (!isRequired) options.unshift('Nenhuma das opções')
        this.isRequired = isRequired
        this.options = options
        this.contentGetter = contentGetter
    }

    public generate(parent: HTMLElement) {
        const select = document.createElement('select')
        const div = document.createElement('div')
        const options = this.options.map(v => `<option>${v}</option>`)
        select.innerHTML = options.join('')
        select.onchange = () => {
            let index = select.selectedIndex
            div.innerHTML = ''
            if (!this.isRequired) {
                if (index == 0) return
                index -= 1
            }
            const content = this.contentGetter(index)
            content.generate(div)
        }
        parent.appendChild(select)
        parent.appendChild(div)
    }
}

interface ISpecificFormFields {
    names: string[],
    addIgnoreFields: string[],
    getNewFields: (parentTags: string[], getField: (name: string) => any) => IBaseFormElement[]
}

function getDocumentation(v: any): string {
    return v.annotation?.documentation?._text ?? 'VAZIO'
}

function getName(v: any): string {
    return v._attributes?.name
}

export function findField(
    rootField: any,
    name: string,
    parentNames: string[] = [],
    parentTag: string = '',
    lvl = 0): { tag: string, parentNames: string[], field: any } {
    const rootName = getName(rootField)
    if (rootName == name) return rootField
    if (parentNames.length == 0) parentNames.push(rootName)
    for (const index in rootField) {
        const field = rootField[index]
        const fieldName = getName(field)
        if (fieldName == name) {
            return {
                tag: isNaN(+index) ? index : parentTag,
                parentNames,
                field
            }
        } else if (lvl < 5) {
            const searchParentNames = fieldName ? [...parentNames, fieldName] : parentNames
            const search = findField(field, name, searchParentNames, index, lvl + 1)
            if (search) return search
        }
    }
}

export class defaultForm {
    static elementosNFe = nfeSchema.schema.complexType[0].sequence.element[0]['complexType']['sequence']['element']

    public elements: IBaseFormElement[] = []

    static generateView(
        rootField: any,
        customRequireds: string[],
        rootTag?: string,
        parentTags: string[] = []): IBaseFormElement[] {
        function isRequired(v: any): boolean {
            const fromSchema = (v._attributes?.minOccurs ?? 1) > 0
            const fromCode = customRequireds.includes(getName(v))
            return fromSchema || fromCode
        }

        function createInput(field: any, parentTags: string[]): IBaseFormElement {
            const fieldRestriction = field.simpleType?.restriction
            const baseType = field._attributes?.type ?? fieldRestriction?._attributes.base
            const findType = (v: any) => getName(v) == baseType
            const hasOtherRestrictions = baseType != 'string'
            const otherRestrictions: any = (simpleTypes.find(findType) as any)?.restriction
            if (hasOtherRestrictions && !otherRestrictions) {
                const complexType = field.complexType ?? complexTypes.find(findType)
                if (!complexType) {
                    console.log(field)
                    throw new Error('Invalid field')
                }
                const newField = { ...field, complexType: { sequence: complexType.sequence } }
                return createFieldset(newField, parentTags)
            }
            if (hasOtherRestrictions && otherRestrictions?._attributes.base != 'string') {
                console.log(otherRestrictions)
                throw new Error('The other restrictions have a invalid base.')
            }
            const enumeration = fieldRestriction?.enumeration ?? otherRestrictions?.enumeration
            if (!enumeration) {
                const name = [...parentTags, getName(field)]
                const documentation = getDocumentation(field)
                const required = isRequired(field)
                const getProp = (el: string) => {
                    const fieldProp = fieldRestriction?.[el]?._attributes.value
                    const otherProp = otherRestrictions?.[el]?._attributes.value
                    return fieldProp ?? otherProp
                }
                return new textFormElement(name, documentation, required, {
                    pattern: getProp('pattern'),
                    minLength: getProp('minLength'),
                    maxLength: getProp('maxLength')
                })
            }
            const name = [...parentTags, getName(field)]
            const required = isRequired(field)
            const documentation = getDocumentation(field)
            if (!('length' in enumeration)) {
                const val = enumeration._attributes.value
                return new hiddenFormElement(name, required, val)
            }
            const val0 = enumeration[0]._attributes.value
            const val1 = enumeration[1]._attributes.value.toUpperCase()
            if (enumeration.length == 2 && val0.toUpperCase() == val1)
                return new hiddenFormElement(name, required, val0)
            const values = (enumeration as any[]).map(v => v._attributes.value)
            const isDesc = (v: string, line: string) => line.includes(v + ' – ')
            const lines = documentation.split('\n')
            const hasText = values.every(v => lines.some(l => isDesc(v, l)))
            const options = values.map(v => {
                return {
                    value: v,
                    text: hasText ? lines.find((l: string) => isDesc(v, l)) : v
                }
            })
            return new selectFormElement(name, documentation, required, options)
        }

        function createChoice(field: any, parentTags: string[]): IBaseFormElement {
            const elements = field['element'] as any[]
            const options = elements.map(v => getDocumentation(v))
            return new choiceFormElement(getDocumentation(field), isRequired(field), options, i => createInput(elements[i], parentTags))
        }

        function createFieldset(field: any, parentTags: string[]): IBaseFormElement {
            const legend = getDocumentation(field)
            const tags = [...parentTags, field._attributes.name]
            if (field.element) {
                const elements = field.element as any[]
                const inputs = elements.map(v => createInput(v, tags))
                return new fieldsetFormElement(legend, ...inputs)
            } else if (field.complexType || field.sequence) {
                const sequence = field.complexType.sequence ?? field.sequence
                const pureFields = Object.entries(sequence)
                const fields = pureFields.flatMap(v => analyseTag(v[0], v[1], tags))
                return new fieldsetFormElement(legend, ...fields)
            } else throw new Error('Invalid tag for a fieldset')
        }

        function createCityField(parentTags: string[], getField: (name: string) => any): IBaseFormElement[] {
            const genEl = (name: string) => {
                const field = getField(name)
                return field
                    ? new hiddenFormElement(
                        [...parentTags, name],
                        isRequired(field))
                    : undefined
            }
            const cMun = genEl('cMun'), xMun = genEl('xMun'), UF = genEl('UF')
            if (!cMun && !xMun) throw new Error('City field without cMun and xMun.')

            const municipio = new selectTextFormElement(
                [], 'Município',
                cMun.required || xMun.required,
                IBGE.flatMap(
                    v => (v.Municipios as any[]).map(
                        k => { return { value: `${k.Nome} (${v.Sigla})` } })),
                (value) => {
                    const startUF = value.indexOf('('),
                        uf = value.substring(startUF + 1, value.length - 1),
                        mun = value.substring(0, startUF - 1),
                        ufIBGE = IBGE.find(v => v.Sigla == uf),
                        munIBGE = ufIBGE?.Municipios.find(v => v.Nome == mun)
                    if (munIBGE) {
                        if (cMun) cMun.value = munIBGE.Codigo
                        if (xMun) xMun.value = munIBGE.Nome
                        if (UF) UF.value = ufIBGE.Sigla
                    } else {
                        if (cMun) cMun.value = undefined
                        if (xMun) xMun.value = undefined
                        if (UF) UF.value = undefined
                    }
                })
            return [cMun, xMun, UF, municipio].filter(v => v)
        }

        function createCountryField(parentTags: string[], getField: (name: string) => any): IBaseFormElement[] {
            const genEl = (name: string) => {
                const field = getField(name)
                return field
                    ? new hiddenFormElement(
                        [...parentTags, name],
                        isRequired(field))
                    : undefined
            }
            const cPais = genEl('cPais'), xPais = genEl('xPais')
            if (!cPais && !xPais) throw new Error('Country field without cPais and xPais.')

            const pais = new selectTextFormElement(
                [], 'País',
                cPais.required || xPais.required,
                paises.map(k => { return { value: k.nome } }),
                (value) => {
                    const pais = paises.find(v => v.nome == value)
                    xPais.value = pais?.nome
                    cPais.value = pais?.codigo
                })
            return [cPais, xPais, pais].filter(v => v)
        }

        function analyseTag(tag: string, field: any, parentTags: string[]): IBaseFormElement[] {
            switch (tag) {
                case 'choice':
                    return [createChoice(field, parentTags)]
                case 'element':
                    const elements = 'length' in field ? field as any[] : [field]
                    const specificFields: ISpecificFormFields[] = [
                        {
                            names: ['cMun', 'xMun'],
                            addIgnoreFields: ['UF'],
                            getNewFields: createCityField
                        },
                        {
                            names: ['cPais', 'xPais'],
                            addIgnoreFields: [],
                            getNewFields: createCountryField
                        }
                    ]
                    const ignoreFields: string[] = []
                    return elements.flatMap(v => {
                        const name = getName(v)
                        if (ignoreFields.includes(name)) return undefined
                        const specific = specificFields.find(k => k.names.includes(name))
                        if (specific) {
                            ignoreFields.push(...specific.names, ...specific.addIgnoreFields)
                            return specific.getNewFields(
                                parentTags,
                                name => elements.find(v => getName(v) == name))
                        }
                        return createInput(v, parentTags)
                    }).filter(v => v)
                default:
                    if (!tag || tag == 'sequence')
                        return [createFieldset(field, parentTags)]
                    console.log(tag)
                    throw new Error('Invalid tag')
            }
        }

        return analyseTag(rootTag, rootField, parentTags)
    }

    public generateForm(): HTMLFormElement {
        const form = document.createElement('form')
        this.elements.forEach(v => v.generate(form))
        const submit = document.createElement('input')
        submit.type = 'submit'
        form.appendChild(submit)
        return form
    }
}
