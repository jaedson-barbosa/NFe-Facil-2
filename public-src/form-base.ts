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

export function getCodigoEstado(sigla: string) {
    return IBGE.find(v => v.Sigla == sigla)?.Codigo
}

export function getRandomNumber(digits: number = 8) {
    var minm = 10 ** (digits - 1);
    var maxm = 10 ** digits - 1;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}

export function defaultFormSubmit(e: Event, onSubmit: (data: any) => void) {
    e.preventDefault()
    var object = {};
    const formData = new FormData(e.target as HTMLFormElement)
    formData.forEach(function (value, key) {
        if (!value) return
        const path = key.split('.')
        let temp = object
        for (let i = 0; i < path.length; i++) {
            const p = path[i];
            const isLast = i === path.length - 1
            if (isLast && Array.isArray(temp)) {
                temp.push(value)
            } else if (isLast) {
                temp[p] = value
            } else if (temp[p]) {
                temp = temp[p]
            } else {
                // se nao houver proximo ou se for alfabetico usa {}
                temp = temp[p] = isNaN(+path[i + 1]) ? {} : []
            }
        }
    });
    onSubmit(object)
    return false
}

function insertLabel(
    input: HTMLSelectElement | HTMLInputElement,
    documentation: string,
    insertBefore = true): HTMLLabelElement {
    const label = document.createElement('label')
    label.htmlFor = input.id = createId()
    const labelFilters = ['\n', '.', '(', '-']
    label.innerText = labelFilters.reduce(
        (p, c) => p.split(c)[0],
        documentation)
    if (insertBefore) {
        input.before(label)
    } else {
        input.after(label)
    }
    return label
}

const customHeaders: { name: string, header: string }[] = [
    { name: 'fone', header: 'Telefone' },
    { name: 'CFOP', header: 'Código Fiscal de Operações e Prestações - CFOP' },
    { name: 'CNPJ|CPF', header: 'Documento usado' },
    { name: 'cRegTrib', header: 'Código do regime especial de tributação\n1=Microempresa Municipal; 2=Estimativa; 3=Sociedade de Profissionais; 4=Cooperativa; 5=Microempresário Individual (MEI); 6=Microempresário e Empresa de Pequeno Porte' },
    {
        name: 'indSomaPISST',
        header: `Indica se o valor do PISST compõe o valor total da NF-e
        0=Valor do PISST não compõe o valor total da NF-e
        1=Valor do PISST compõe o valor total da NF-e`
    },
    {
        name: 'indSomaCOFINSST',
        header: `Indica se o valor da COFINS ST compõe o valor total da NF-e
        0=Valor da COFINSST não compõe o valor total da NF-e
        1=Valor da COFINSST compõe o valor total da NF-e`
    }
]

export interface IBaseFormElement {
    generate: (parent: HTMLElement) => HTMLElement
    updateValue: (values: any) => void
}

interface IGenericOptions {
    valueParent: HTMLElement
    value: IBaseFormElement
}

export class genericFormElement implements IBaseFormElement {
    private element: HTMLElement
    private options: IGenericOptions

    constructor(el: HTMLElement, options?: IGenericOptions) {
        this.element = el
        if (options) this.options = options
    }

    public generate(parent: HTMLElement) {
        if (this.options) {
            const value = this.options.value
            const valueParent = this.options.valueParent
            value.generate(valueParent)
        }
        const element = this.element
        parent.appendChild(element)
        return element
    }

    public updateValue(values: any) {
        if (this.options) {
            const value = this.options.value
            value.updateValue(values)
        }
    }
}

abstract class inputFormElement implements IBaseFormElement {
    public name: string[]
    protected documentation: string
    public required: boolean
    public value: string

    constructor(
        name: string[],
        documentation: string,
        required: boolean,
        value?: string) {
        this.name = name
        this.documentation = documentation
        this.required = required
        if (value) this.value = value
    }

    public abstract generate(parent: HTMLElement): HTMLElement;

    public updateValue(values: any) {
        let value: string;
        for (const i in this.name) {
            const name = this.name[i]
            value = values[name]
            if (!value) break
        }
        if (value) this.value = value
    }

    protected updateBaseProps(input: HTMLSelectElement | HTMLInputElement) {
        const name = this.name
        input.name = name.filter(v => !v.includes('|')).join('.')
        const index = name.map(v => !isNaN(+v)).lastIndexOf(true)
        if (index != -1) this.name[index] = (+name[index] + 1).toString()
        input.title = this.documentation
        input.required = this.required
        if (this.value) input.value = this.value
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
        insertLabel(select, this.documentation)
        return select
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
        insertLabel(text, this.documentation)
        return text
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
        const select = document.createElement('input')
        select.title = this.documentation
        const datalist = document.createElement('datalist')
        datalist.innerHTML = this.options.map(
            k => `<option>${k.value}</option>`).join('')
        select.setAttribute('list', datalist.id = createId())
        select.onchange = () => this.onChange(select.value)
        parent.appendChild(datalist)
        parent.appendChild(select)
        insertLabel(select, this.documentation)
        select.onchange = () => {
            const isValid = this.options.some(v => v.value == select.value)
            const validity = isValid ? '' : 'Por favor, selecione um valor válido.'
            select.setCustomValidity(validity)
        }
        select.setCustomValidity('Selecione um valor.')
        return select
    }
}

export class hiddenFormElement extends inputFormElement {
    constructor(
        name: string[],
        required: boolean,
        value?: string) {
        super(name, '', required, value)
    }

    public generate(parent: HTMLElement) {
        const hidden = document.createElement('input')
        hidden.type = 'hidden'
        this.updateBaseProps(hidden)
        parent.appendChild(hidden)
        return hidden
    }
}

interface IFieldsetOptions {
    legend: string
    required: boolean
}

export class fieldsetFormElement implements IBaseFormElement {
    public options: IFieldsetOptions
    public children: IBaseFormElement[]

    constructor(options: IFieldsetOptions, ...children: IBaseFormElement[]) {
        this.options = options
        this.children = children
    }

    public generate(parent: HTMLElement) {
        const createFieldset: () => HTMLFieldSetElement = () => {
            const content = document.createElement('fieldset')
            if (this.options.legend) {
                const legend = document.createElement('legend')
                legend.innerText = this.options.legend
                content.appendChild(legend)
            }
            this.children.forEach(v => v.generate(content))
            return content
        }
        if (this.options.required) {
            const content = createFieldset()
            parent.appendChild(content)
            return content
        } else {
            if (!this.options.legend) {
                console.error('Campo opcional sem legenda!')
            }
            const check = document.createElement('input')
            check.type = 'checkbox'
            parent.appendChild(check)
            const label = insertLabel(check, 'Informar campo: ' + this.options.legend, false)
            let fieldset: HTMLFieldSetElement;
            check.onchange = () => {
                if (check.checked) {
                    fieldset = createFieldset()
                    label.after(fieldset)
                } else {
                    fieldset?.remove()
                }
            }
            return fieldset
        }
    }

    public updateValue(values: any) {
        this.children.forEach(v => v.updateValue(values))
    }
}

export class choiceFormElement implements IBaseFormElement {
    private documentation: string
    private options: { text: string, view: IBaseFormElement }[]

    constructor(
        documentation: string,
        isRequired: boolean,
        options: { text: string, view: IBaseFormElement }[]) {
        this.documentation = documentation
        if (!isRequired) {
            options.unshift({
                text: 'Nenhuma das opções',
                view: undefined
            })
        }
        this.options = options
    }

    public generate(parent: HTMLElement) {
        const select = document.createElement('select')
        const div = document.createElement('div')
        const options = this.options.map(v => `<option>${v.text}</option>`)
        select.innerHTML = options.join('')
        const updateView = () => {
            let index = select.selectedIndex
            div.innerHTML = ''
            const view = this.options[index].view
            view?.generate(div)
        }
        select.onchange = () => updateView()
        parent.appendChild(select)
        parent.appendChild(div)
        insertLabel(select, this.documentation)
        updateView()
        return select
    }

    public updateValue(values: any) { }
}

export class listFormElement implements IBaseFormElement {
    private name: string[]
    private content: IBaseFormElement
    private container: fieldsetFormElement

    constructor(
        parentNames: string[],
        root: any,
        customRequireds: string[],
        name: string) {
        this.name = [...parentNames, name]
        const els = defaultForm.generateViews(
            root,
            {
                customRequireds,
                parentNames,
                customNameChanger: v => {
                    v.splice(v.indexOf('NFref') + 1, 0, '0')
                    return v
                }
            },
            name)
        if (els.length != 1) throw new Error('Invalid content length')
        if (els[0] instanceof fieldsetFormElement) {
            const el = els[0] as fieldsetFormElement
            this.content = el.children[0]
            el.children = []
            this.container = el
        }
        else throw new Error('Invalid content type')
    }

    public generate(parent: HTMLElement) {
        const addHTML = document.createElement('button')
        addHTML.innerText = 'Adicionar item'
        const add = new genericFormElement(addHTML)
        this.container.children.unshift(add)
        const container = this.container.generate(parent)
        addHTML.onclick = () => {
            const details = document.createElement('details')
            details.open = true
            const summary = document.createElement('summary')
            summary.innerText = 'Item'
            details.appendChild(summary)
            this.content.generate(details)
            const remHTML = document.createElement('button')
            remHTML.innerText = 'Remover item'
            details.appendChild(remHTML)
            container.appendChild(details)
            remHTML.onclick = () => details.remove()
        }
        return container
        //Botar botão de adicionar, cancelar, editar e remover. Usar índice numerico e mexer na geração de dados do form geral e especifico
    }

    public updateValue(values: any) { }
}

interface ISpecificFormFields {
    names: string[],
    addIgnoreFields: string[],
    getNewFields: (parentTags: string[], getField: (name: string) => any) => IBaseFormElement[]
}

function getDocumentation(v: any): string {
    const name = getName(v)
    const custom = customHeaders.find(v => name === v.name)?.header
    return custom ?? v.annotation?.documentation?._text ?? ''//'VAZIO'
}

function getName(v: any): string {
    const name = v._attributes?.name
    if (!name && typeof v == 'object') {
        const isRootList = 'length' in v
        if (isRootList || v.element) {
            const listParent = isRootList ? v : v.element
            const childNames = listParent.map(getName).join('|')
            return childNames
        }
    }
    return name
}

function findField(
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

interface IGenerateViewOptions {
    customRequireds?: string[],
    rootTag?: string,
    parentTags?: string[]
    customNameChanger?: (names: string[]) => string[]
}

interface IGenerateViewsOptions {
    customRequireds?: string[],
    parentNames?: string[],
    customNameChanger?: (names: string[]) => string[]
}

export class defaultForm {
    static rootNFe = nfeSchema.schema.complexType[0].sequence.element[0]
    static elementosNFe = defaultForm.rootNFe['complexType']['sequence']['element']

    public elements: IBaseFormElement[] = []

    static generateViews(rootField: any, options: IGenerateViewsOptions, ...names: string[]) {
        return names.flatMap(name => {
            const field = findField(rootField, name)
            const view = defaultForm.generateView(
                field.field,
                {
                    customRequireds: options.customRequireds ?? [],
                    rootTag: field.tag,
                    parentTags: options.parentNames ? [...options.parentNames, ...field.parentNames] : field.parentNames,
                    customNameChanger: options.customNameChanger
                })
            return view
        })
    }

    static generateView(
        rootField: any,
        options?: IGenerateViewOptions): IBaseFormElement[] {
        const customRequireds = options?.customRequireds ?? []
        const rootTag = options?.rootTag
        const parentTags = options?.parentTags ?? []

        function isRequired(v: any): boolean {
            const fromSchema = (v._attributes?.minOccurs ?? 1) > 0
            const fromCode = customRequireds.includes(getName(v))
            return fromSchema || fromCode
        }

        function createInput(field: any, parentTags: string[]): IBaseFormElement {
            const fieldRestriction = field.simpleType?.restriction
            const baseType = field._attributes?.type ?? fieldRestriction?._attributes.base
            const findType = (v: any) => getName(v) == baseType
            const hasOtherRestrictions = baseType != 'string' && baseType != 'base64Binary'
            const otherRestrictions: any = (simpleTypes.find(findType) as any)?.restriction
            if (hasOtherRestrictions && !otherRestrictions) {
                const complexType = field.complexType ?? complexTypes.find(findType)
                if (!complexType) {
                    console.log(field)
                    throw new Error('Invalid field')
                }
                const newField = { ...field, complexType: complexType }
                return createFieldset(newField, parentTags)
            }
            if (hasOtherRestrictions && otherRestrictions?._attributes.base != 'string') {
                console.log(otherRestrictions)
                throw new Error('The other restrictions have a invalid base.')
            }
            const enumeration = fieldRestriction?.enumeration ?? otherRestrictions?.enumeration
            const name = [...parentTags, getName(field)]
            if (options.customNameChanger) options.customNameChanger(name)
            const required = isRequired(field)
            const documentation = getDocumentation(field)
            if (!enumeration) {
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
            if (!('length' in enumeration)) {
                const val = enumeration._attributes.value
                return new hiddenFormElement(name, required, val)
            }
            const val0 = enumeration[0]._attributes.value
            const val1 = enumeration[1]._attributes.value.toUpperCase()
            if (enumeration.length == 2 && val0.toUpperCase() == val1)
                return new hiddenFormElement(name, required, val0)
            const values = (enumeration as any[]).map(v => v._attributes.value)
            const getValueDescription = (v: string) => {
                if (isNaN(+v)) return v
                const getIndex = (search: string) => documentation.indexOf(search)
                const getIndexEnd = (mark: string, pos: number) => documentation.indexOf(mark, pos)
                const starts = v.includes('.00')
                    ? [getIndex(v.replace('.00', '%'))]
                    : ['-', ' -', '  –', ' –', '–', '=', ' ='].map(k => getIndex(v + k)).filter(v => v != -1)
                if (starts.length == 0) return v
                const start = Math.min(...starts)
                const ends = [';', '.', '\n', '(', ')'].map(k => getIndexEnd(k, start)).filter(k => k != -1)
                if (ends.length == 0) {
                    return documentation.substring(start)
                }
                let end = Math.min(...ends)
                return documentation.substring(start, end)
            }
            const getOption = (v: any, processDescription: boolean = true) => {
                return {
                    value: v,
                    text: processDescription ? getValueDescription(v) : v
                }
            }
            const firstOption = getOption(values[0])
            const optionsHaveDescriptions = firstOption.text != firstOption.value
            const otherValues = values.slice(1)
            let stopValuesMap = false
            const otherOptions = optionsHaveDescriptions ? otherValues.map(v => {
                if (stopValuesMap) return undefined
                const opt = getOption(v, true)
                if (opt.value == opt.text) {
                    stopValuesMap = true
                    return undefined
                }
                return opt
            }).filter(v => v) : otherValues.map(v => getOption(v, false))
            return new selectFormElement(
                name,
                documentation,
                required,
                [firstOption, ...otherOptions])
        }

        function createChoice(field: any, parentTags: string[]): IBaseFormElement {
            try {
                const elements = field.element as any[]
                const sequences = field.sequence as any[]
                if (elements) {
                    const options = elements.map(v => { return {
                        text: getDocumentation(v),
                        view: createInput(v, parentTags)
                    }})
                    return new choiceFormElement(
                        getDocumentation(field),
                        isRequired(field),
                        options)
                }
                else if (sequences) {
                    const options = sequences.map(v => { return {
                        text: getDocumentation(v),
                        view: createFieldset(v, parentTags)
                    }})
                    return new choiceFormElement(
                        getDocumentation(field),
                        isRequired(field),
                        options)
                }
            } catch (error) {
                console.log(field)
                throw error
            }
        }

        function createFieldset(field: any, parentTags: string[]): IBaseFormElement {
            const legend = getDocumentation(field)
            const name = getName(field)
            const tags = name ? [...parentTags, name] : parentTags
            const isRootList = 'length' in field
            const required = isRequired(field)
            if (isRootList || field.element) {
                const elements = (isRootList ? field : field.element) as any[]
                const inputs = elements.map(v => createInput(v, tags))
                return new fieldsetFormElement({ legend, required }, ...inputs)
            } else if (field.complexType || field.sequence) {
                const sequence = field.complexType?.sequence ?? field.sequence
                let fields: IBaseFormElement[]
                if (sequence) {
                    const pureFields = Object.entries(sequence)
                    fields = pureFields.flatMap(v => analyseTag(v[0], v[1], tags))
                }
                const choice = field.complexType?.choice
                if (choice) {
                    fields = [createChoice(choice, tags)]
                }
                return new fieldsetFormElement({ legend, required }, ...fields)
            } else {
                console.log(field)
                throw new Error('Invalid tag for a fieldset')
            }
        }

        function createCityField(
            parentTags: string[],
            getField: (name: string) => any): IBaseFormElement[] {
            const genEl = (name: string) => {
                const field = getField(name)
                return field
                    ? new hiddenFormElement(
                        [...parentTags, name],
                        isRequired(field))
                    : undefined
            }
            const cMun = genEl('cMun'), cMunFG = genEl('cMunFG'), xMun = genEl('xMun'), UF = genEl('UF')
            if (!cMun && !cMunFG && !xMun) throw new Error('City field without cMun and xMun.')

            const municipio = new selectTextFormElement(
                [], 'Município',
                cMun?.required || cMunFG?.required || xMun?.required,
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
                        if (cMunFG) cMunFG.value = munIBGE.Codigo
                        if (xMun) xMun.value = munIBGE.Nome
                        if (UF) UF.value = ufIBGE.Sigla
                    } else {
                        if (cMun) cMun.value = undefined
                        if (cMunFG) cMunFG.value = undefined
                        if (xMun) xMun.value = undefined
                        if (UF) UF.value = undefined
                    }
                })
            return [cMun, xMun, UF, municipio].filter(v => v)
        }

        function createStateField(parentTags: string[],
            getField: (name: string) => any): IBaseFormElement[] {
            const genEl = (name: string) => {
                const field = getField(name)
                return field
                    ? new hiddenFormElement(
                        [...parentTags, name],
                        isRequired(field))
                    : undefined
            }
            const cUF = genEl('cUF'), UF = genEl('UF')
            if (!cUF && !UF) throw new Error('State field without cUF and UF.')

            const uf = new selectTextFormElement(
                [], 'Estado',
                cUF?.required || UF?.required,
                IBGE.flatMap(
                    v => { return { value: v.Nome } }),
                (value) => {
                    const uf = IBGE.find(v => v.Nome == value)
                    if (cUF) cUF.value = uf?.Codigo
                    if (UF) UF.value = uf?.Sigla
                })
            return [cUF, UF, uf].filter(v => v)
        }

        function createCountryField(
            parentTags: string[],
            getField: (name: string) => any): IBaseFormElement[] {
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
                cPais?.required || xPais?.required,
                paises.map(k => { return { value: k.nome } }),
                (value) => {
                    const pais = paises.find(v => v.nome == value)
                    if (xPais) xPais.value = pais?.nome
                    if (cPais) cPais.value = pais?.codigo
                })
            return [cPais, xPais, pais].filter(v => v)
        }

        function createElements(field: any, parentTags: string[]) {
            const elements = 'length' in field ? field as any[] : [field]
            const specificFields: ISpecificFormFields[] = [
                {
                    names: ['cMun', 'xMun', 'cMunFG'],
                    addIgnoreFields: ['cUF', 'UF'],
                    getNewFields: createCityField
                },
                {
                    names: ['cUF', 'UF'],
                    addIgnoreFields: [],
                    getNewFields: createStateField
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
        }

        function analyseTag(tag: string, field: any, parentTags: string[]): IBaseFormElement[] {
            switch (tag) {
                case 'choice':
                    return [createChoice(field, parentTags)]
                case 'element':
                    return createElements(field, parentTags)
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

    public updateValue(values: any) {
        this.elements.forEach(v => v.updateValue(values))
    }
}
