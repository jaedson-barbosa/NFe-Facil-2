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

function processLabelText(documentation: string) {
    const text = documentation.startsWith('Informar campo')
        ? documentation
        : ['\n', '.', ':', ' - ', ', ', '(1'].reduce((p, c) => p.split(c)[0], documentation)
    return text.charAt(0).toUpperCase() + text.slice(1)
}

function insertLabel(
    input: HTMLSelectElement | HTMLInputElement,
    documentation: string,
    insertBefore = true): HTMLLabelElement {
    const label = document.createElement('label')
    label.htmlFor = input.id = createId()
    label.innerText = processLabelText(documentation)
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
    },
    { name: 'veicTransp|reboque', header: 'Veículo' },
    { name: 'lacres', header: 'Lacres' },
    { name: 'pag', header: 'Informações de Pagamento' },
    { name: 'cBenef', header: 'Código de Benefício Fiscal na UF aplicado ao item' },
    { name: 'indTot', header: `O valor do item:
0 – Não compõe o valor total da NF-e
1 – Compõe o valor total da NF-e` },
    { name: 'CEST|indEscala|CNPJFab', header: `Código Especificador da Substituição Tributária`},
    { name: 'indEscala', header: `Indicador de Produção em escala relevante
S - Produzido em escala relevante
N – Produzido em escala não relevante` },
    { name: 'cProdANVISA', header: 'Código de Produto da ANVISA' },
    { name: 'xMotivoIsencao', header: 'Motivo da isenção da ANVISA' },
    { name: 'ICMSUFDest', header: 'Dados do ICMS Interestadual' },
    { name: 'IPI|ISSQN', header: 'Tributação para serviços' },
    { name: 'ICMS|IPI|II', header: 'Tributação para produtos' },
    { name: 'IPI', header: 'Imposto sobre produtos industrializados' },
    { name: 'impostoDevol', header: 'Informação do imposto devolvido' },
    { name: 'pFCP|vFCP', header: 'Fundo de combate à pobreza' },
    { name: 'pFCPST|vFCPST', header: 'Fundo de combate à pobreza retido por substituição tributária' },
    { name: 'pFCPSTRet|vFCPSTRet', header: 'Fundo de combate à pobreza retido anteriormente por substituição tributária' },
    { name: 'vICMSDeson|motDesICMS', header: 'Valor do ICMS/Motiva da desoneração' },
    { name: 'pRedBCEfet|vBCEfet', header: 'Informações do ICMS Efetivo' },
    { name: 'pICMS|vICMS', header: 'Informações do ICMS' },
    { name: 'pICMSST|vICMSST', header: 'Informações do ICMS ST' },
    { name: 'vBCSTRet|pST|vICMSSubstituto|vICMSSTRet', header: 'Informações do ICMS ST cobrado anteriormente' },
    { name: 'pCredSN|vCredICMSSN', header: 'Informações de crédito do ICMS' },
    { name: 'vBC|pIPI', header: 'Cálculo de IPI por alíquota' },
    { name: 'vBC|pPIS', header: 'Cálculo de PIS por alíquota' },
    { name: 'vBC|pCOFINS', header: 'Cálculo de COFINS por alíquota' },
    { name: 'qUnid|vUnid', header: 'Cálculo de IPI por valor de unidade' },
    { name: 'qBCProd|vAliqProd', header: 'Cálculo de por valor de unidade' },
    { name: 'IPITrib', header: 'IPI tributado' },
    { name: 'IPINT', header: 'IPI não tributado' },
    { name: 'IPITrib|IPINT', header: 'Tipo de IPI' },
    { name: 'cAgreg', header: 'Código de agregação' }
]

export interface IBaseFormElement {
    generate: (parent: HTMLElement) => HTMLElement
    updateValue: (values: any) => void
    resetValue: () => void
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

    public updateValue(values: any) { this.options?.value.updateValue(values) }
    public resetValue() { this.options?.value.resetValue() }
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
        const value = this.name.filter(v => !v.includes('|')).reduce((p,c) => p?.[c], values)
        if (value) this.value = value
    }

    public resetValue() { this.value = undefined }

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

export class selectTextFormElement implements IBaseFormElement {
    private documentation: string
    private required: boolean
    private options: { value: string, helpText?: string }[]
    private onChange: (value: string) => void
    private getOption: (values: any) => string
    private startValue: string

    constructor(
        documentation: string,
        required: boolean,
        options: { value: string, helpText?: string }[],
        onChange: (value: string) => void,
        getOption: (values: any) => string) {
        this.documentation = documentation
        this.required = required
        this.options = options
        this.onChange = onChange
        this.getOption = getOption
    }

    public generate(parent: HTMLElement) {
        const select = document.createElement('input')
        select.title = this.documentation
        select.required = this.required
        const datalist = document.createElement('datalist')
        datalist.innerHTML = this.options.map(
            k => `<option>${k.value}</option>`).join('')
        select.setAttribute('list', datalist.id = createId())
        parent.appendChild(datalist)
        parent.appendChild(select)
        insertLabel(select, this.documentation)
        select.onchange = () => {
            if (!select.value && !this.required) {
                select.setCustomValidity('')
                this.onChange(undefined)
            }
            const isValid = this.options.some(v => v.value == select.value)
            const validity = isValid ? '' : 'Por favor, selecione um valor válido.'
            select.setCustomValidity(validity)
            this.onChange(isValid ? select.value : undefined)
        }
        select.setCustomValidity(this.required ? 'Selecione um valor.' : '')
        if (this.startValue) select.value = this.startValue
        return select
    }

    public updateValue(values: any) {
        const option = this.getOption(values)
        this.startValue = option
    }

    public resetValue() { this.startValue = undefined }
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
    hidden?: boolean
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
            if (this.options.hidden) {
                content.style.display = 'none'
            }
            if (this.options.legend) {
                const legend = document.createElement('legend')
                legend.innerText = this.options.legend
                content.appendChild(legend)
            }
            this.children.forEach(v => v.generate(content))
            return content
        }
        if (this.options.required && (this.options.legend || this.options.hidden)) {
            const content = createFieldset()
            parent.appendChild(content)
            return content
        } else if (this.options.required) {
            const content = document.createElement('div')
            this.children.forEach(v => v.generate(content))
            parent.appendChild(content)
            return content
        } else {
            if (!this.options.legend) {
                console.error('Campo opcional sem legenda!')
                this.options.legend = 'SEM LEGENDA'
            }
            const check = document.createElement('input')
            check.type = 'checkbox'
            parent.appendChild(check)
            // check.before(document.createElement('br'))
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

    public resetValue() { this.children.forEach(v => v.resetValue()) }
}

interface IChoiceOption {
    text: string
    view: IBaseFormElement
    name: string
}

export class choiceFormElement implements IBaseFormElement {
    private documentation: string
    private options: IChoiceOption[]
    private parentNames: string[]
    private startIndex: number

    constructor(
        documentation: string,
        isRequired: boolean,
        options: IChoiceOption[],
        parentNames: string[]) {
        this.documentation = documentation
        if (!isRequired) {
            options.unshift({
                text: 'Nenhuma das opções',
                view: undefined,
                name: 'none'
            })
        }
        this.options = options
        this.parentNames = parentNames
        this.startIndex = 0
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
        select.selectedIndex = this.startIndex
        updateView()
        return select
    }

    public updateValue(values: any) {
        const baseValue = this.parentNames.filter(v => !v.includes('|')).reduce((p,c) => p?.[c], values)
        const keys = Object.keys(baseValue)
        const index = this.options.findIndex(v => v.name.split('|').some(k => keys.includes(k)))
        const option = this.options[index]
        option.view.updateValue(values)
        this.startIndex = index
    }

    public resetValue() { this.startIndex = 0 }
}

export function getDefaultListNameChanger(name: string) {
    return v => {
        v.splice(v.indexOf(name) + 1, 0, '0')
        return v
    }
}

export class listFormElement implements IBaseFormElement {
    private content: IBaseFormElement[]
    private container: fieldsetFormElement
    private parentNames: string[]
    private addHTML: HTMLButtonElement
    private startValues: any[]

    constructor(el: fieldsetFormElement, parentNames: string[]) {
        this.content = el.children
        const addHTML = document.createElement('button')
        addHTML.type = 'button'
        addHTML.innerText = 'Adicionar item'
        const add = new genericFormElement(addHTML)
        el.children = [add]
        this.addHTML = addHTML
        this.container = el
        this.startValues = []
    }

    public generate(parent: HTMLElement) {
        const container = this.container.generate(parent)
        const addItem = (content?: any) => {
            const details = document.createElement('details')
            details.open = true
            const summary = document.createElement('summary')
            summary.innerText = 'Item'
            details.appendChild(summary)
            this.content.forEach(v => content 
                ? v.updateValue(content)
                : v.resetValue())
            this.content.forEach(v => v.generate(details))
            const remHTML = document.createElement('button')
            remHTML.type = 'button'
            remHTML.innerText = 'Remover item'
            details.appendChild(remHTML)
            container.appendChild(details)
            remHTML.onclick = () => details.remove()
        }
        this.addHTML.onclick = () => addItem()
        this.startValues.forEach(v => addItem(v))
        return container
    }

    public updateValue(values: any) {
        const baseValue = this.parentNames.filter(v => !v.includes('|')).reduce((p,c) => p?.[c], values)
        if (baseValue && Array.isArray(baseValue)) {
            this.startValues = baseValue
        }
    }

    public resetValue() { this.startValues = [] }
}

interface ISpecificFormFields {
    names: string[],
    addIgnoreFields: string[],
    getNewFields: (parentTags: string[], getField: (name: string) => any) => IBaseFormElement[]
}

function getDocumentation(v: any): string {
    const name = getName(v)
    const fromScheme = v.annotation?.documentation?._text
    if (name) {
        const custom = customHeaders.find(v => name === v.name)?.header
        const nameParts = name.split('|')
        return custom ?? customHeaders.find(
            v => {
                const customParts = v.name.split('|')
                return customParts.every(k => nameParts.includes(k))
            })?.header ?? fromScheme ?? ''
    }
    return fromScheme ?? ''
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
            return defaultForm.generateView(
                field.field,
                {
                    customRequireds: options.customRequireds ?? [],
                    rootTag: field.tag,
                    parentTags: options.parentNames ? [...options.parentNames, ...field.parentNames] : field.parentNames,
                    customNameChanger: options.customNameChanger
                })
        })
    }

    static generateView(
        rootField: any,
        options?: IGenerateViewOptions): IBaseFormElement[] {
        const customRequireds = options?.customRequireds ?? []
        const rootTag = options?.rootTag
        const parentTags = options?.parentTags ?? []

        function isRequired(v: any): boolean {
            if (customRequireds.includes(getName(v))) return true
            const element = v.element
            if (element && Array.isArray(element)) {
                const required = element.every(k => isRequired(k) || customRequireds.includes(getName(k)))
                if (!required) return false
            }
            const seq = v.sequence
            if (seq) {
                const sequence = Array.isArray(seq) ? seq : seq.element as any[]
                const required = sequence.every(k => isRequired(k) || customRequireds.includes(getName(k)))
                if (!required) return false
            }
            return (v._attributes?.minOccurs ?? 1) > 0
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
                    const element = field.element
                    if (!element) {
                        console.log(field)
                        throw new Error('Invalid field')
                    }
                    return createFieldset(field, parentTags)
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
            if (options?.customNameChanger) options.customNameChanger(name)
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
                if (isNaN(+v) && v.length > 1) return v
                const getIndex = (search: string) => documentation.indexOf(search)
                const getIndexEnd = (mark: string, pos: number) => documentation.indexOf(mark, pos)
                const starts = v.includes('.00')
                    ? [getIndex(v.replace('.00', '%'))]
                    : ['-', ' -', '  –', ' –', '–', '=', ' ='].map(k => getIndex(v + k)).filter(v => v != -1)
                if (starts.length == 0) return v
                const start = Math.min(...starts)
                const ends = [';', '.', ')', '\n'].map(k => getIndexEnd(k, start)).filter(k => k != -1)
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
            const elements = field.element as any[]
            const sequence = field.sequence
            if (!elements && !sequence) {
                throw new Error('Choice invalido');
            }
            let options: IChoiceOption[] = []
            if (elements) {
                options.push(...elements.map(v => {
                    return {
                        text: getDocumentation(v),
                        view: createInput(v, parentTags),
                        name: getName(v)
                    }
                }))
            }
            if (sequence) {
                if (options.length > 0) {
                    options.push({
                        text: getDocumentation(sequence),
                        view: createFieldset(sequence, parentTags),
                        name: getName(sequence)
                    })
                } else {
                    const array = Array.isArray(sequence) ? sequence : sequence.element as any[]
                    options.push(...array.map(v => {
                        return {
                            text: getDocumentation(v),
                            view: createInput(v, parentTags),
                            name: getName(v)
                        }
                    }))
                }
            }
            const doc = getDocumentation(field)
            const req = isRequired(field)
            return new choiceFormElement(doc, req, options, parentTags)
        }

        function createFieldset(field: any, parentTags: string[]): IBaseFormElement {
            const legend = processLabelText(getDocumentation(field))
            const name = getName(field)
            const tags = name ? [...parentTags, name] : parentTags
            const isRootList = 'length' in field
            const max = field._attributes?.maxOccurs ?? 1
            const required = max > 1 || isRequired(field)
            const fields: IBaseFormElement[] = []
            if (isRootList || field.element) {
                const elements = (isRootList ? field : field.element) as any[]
                fields.push(...elements.map(v => createInput(v, tags)))
            }
            if (field.complexType || field.sequence) {
                const sequence = field.complexType?.sequence ?? field.sequence
                if (sequence) {
                    if (fields.length == 0) {
                        const pureFields = Object.entries(sequence)
                        fields.push(...pureFields.flatMap(v => analyseTag(v[0], v[1], tags)))
                    }
                    else fields.push(createFieldset(sequence, tags))
                }
                const choice = field.complexType?.choice
                if (choice) {
                    fields.push(createChoice(choice, tags))
                }
            }
            if (!fields.length) {
                console.log(field)
                throw new Error('Invalid tag for a fieldset')
            }
            const fieldset = new fieldsetFormElement({ legend, required }, ...fields)
            return max > 1 ? new listFormElement(fieldset, tags) : fieldset
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
            const cMun = genEl('cMun'),
                cMunFG = genEl('cMunFG'),
                xMun = genEl('xMun'),
                UF = genEl('UF'),
                cUF = genEl('cUF')
            if (!cMun && !cMunFG && !xMun) throw new Error('City field without cMun and xMun.')

            const mun2str = (mun: string, uf: string) => `${mun} (${uf})`
            const municipio = new selectTextFormElement(
                'Município',
                cMun?.required || cMunFG?.required || xMun?.required,
                IBGE.flatMap(
                    v => v.Municipios.map(
                        k => { return { value: mun2str(k.Nome, v.Sigla) } })),
                value => {
                    if (value) {
                        const startUF = value.indexOf('('),
                            uf = value.substring(startUF + 1, value.length - 1),
                            ufIBGE = IBGE.find(v => v.Sigla == uf),
                            mun = value.substring(0, startUF - 1),
                            munIBGE = ufIBGE?.Municipios.find(v => v.Nome == mun)
                        if (munIBGE) {
                            if (cMun) cMun.value = munIBGE.Codigo
                            if (cMunFG) cMunFG.value = munIBGE.Codigo
                            if (xMun) xMun.value = munIBGE.Nome
                            if (UF) UF.value = ufIBGE.Sigla
                            if (cUF) cUF.value = ufIBGE.Codigo
                            return
                        }
                    }
                    if (cMun) cMun.value = undefined
                    if (cMunFG) cMunFG.value = undefined
                    if (xMun) xMun.value = undefined
                    if (UF) UF.value = undefined
                    if (cUF) cUF.value = undefined
                },
                values => {
                    const filteredNames = parentTags.filter(v => !v.includes('|'))
                    const baseValue = filteredNames.reduce((p,c) => p?.[c], values)
                    if (!baseValue) return undefined
                    const cUFValue = baseValue['cUF']
                    const ufValue = baseValue['UF']
                    const cMunValue = baseValue['cMun'] ?? baseValue['cMunFG']
                    const xMunValue = baseValue['xMun']
                    if (cMunValue || xMunValue) {
                        const uf = cUFValue
                            ? IBGE.find(v => v.Codigo == cUFValue)
                            : ufValue
                            ? IBGE.find(v => v.Sigla.toUpperCase() == ufValue.toUpperCase())
                            : cMunValue
                            ? IBGE.find(v => v.Municipios.some(k => k.Codigo == cMunValue))
                            : IBGE.find(v => v.Municipios.some(
                                k => k.Nome.toUpperCase() == xMunValue.toUpperCase()))
                        if (!uf) return undefined
                        const munValue = cMunValue
                            ? uf.Municipios.find(v => v.Codigo === cMunValue)
                            : uf.Municipios.find(
                                k => k.Nome.toUpperCase() == xMunValue.toUpperCase())
                        return mun2str(munValue.Nome, uf.Sigla)
                    }
                    console.log(baseValue)
                    return undefined
                })
            return [cMun, xMun, cUF, UF, municipio].filter(v => v)
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
                'Estado',
                cUF?.required || UF?.required,
                IBGE.flatMap(
                    v => { return { value: v.Nome } }),
                value => {
                    const uf = IBGE.find(v => v.Nome == value)
                    if (cUF) cUF.value = uf?.Codigo
                    if (UF) UF.value = uf?.Sigla
                },
                values => {
                    const filteredNames = parentTags.filter(v => !v.includes('|'))
                    const baseValue = filteredNames.reduce((p,c) => p?.[c], values)
                    if (!baseValue) return undefined
                    const cUFValue = baseValue['cUF']
                    const ufValue = baseValue['UF']
                    if (cUFValue || ufValue) {
                        const uf = cUFValue
                            ? IBGE.find(v => v.Codigo == cUFValue)
                            : IBGE.find(v => v.Sigla.toUpperCase() == ufValue.toUpperCase())
                        return uf?.Nome
                    }
                    return undefined
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
                'País',
                cPais?.required || xPais?.required,
                paises.map(k => { return { value: k.nome } }),
                (value) => {
                    const pais = paises.find(v => v.nome == value)
                    if (xPais) xPais.value = pais?.nome
                    if (cPais) cPais.value = pais?.codigo
                },
                values => {
                    const filteredNames = parentTags.filter(v => !v.includes('|'))
                    const baseValue = filteredNames.reduce((p,c) => p?.[c], values)
                    if (!baseValue) return undefined
                    const cPais = baseValue['cPais']
                    const xPais = baseValue['xPais']
                    if (cPais || xPais) {
                        const uf = cPais
                            ? paises.find(v => v.codigo == cPais)
                            : paises.find(v => v.nome.toUpperCase() == xPais.toUpperCase())
                        return uf?.nome
                    }
                    return undefined
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
                    console.error('Invalid tag', tag)
                    return []
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
