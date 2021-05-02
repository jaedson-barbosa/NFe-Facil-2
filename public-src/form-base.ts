import * as basicSchema from './base-data/basic.json'
import * as nfeSchema from './base-data/nfe.json'
import { IBGE } from './base-data/IBGE.json'
import { paises } from './base-data/paises.json'

export function getForm(index: number = 0) {
  return document.getElementsByTagName('form')[index]
}

const complexTypes = nfeSchema['xs:schema']['xs:complexType']
const simpleTypes = [
  ...basicSchema['xs:schema']['xs:simpleType'],
  ...nfeSchema['xs:schema']['xs:simpleType'],
]

export function createId(): string {
  const AUTO_ID_CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return [...Array(20)]
    .map(() => {
      const index = Math.floor(Math.random() * AUTO_ID_CHARS.length)
      return AUTO_ID_CHARS.charAt(index)
    })
    .join('')
}

export function getCodigoEstado(sigla: string) {
  return IBGE.find((v) => v.Sigla == sigla)?.Codigo
}

export function getRandomNumber(digits: number = 8) {
  var minm = 10 ** (digits - 1)
  var maxm = 10 ** digits - 1
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm
}

export function defaultFormSubmit(onSubmit: (data: any) => void, e: Event)
export function defaultFormSubmit(
  onSubmit: (data: any) => void,
  form: HTMLFormElement
)
export function defaultFormSubmit(
  onSubmit: (data: any) => void,
  param: Event | HTMLFormElement
) {
  let form: HTMLFormElement
  if (param instanceof Event) {
    param.preventDefault()
    form = param.target as HTMLFormElement
  } else {
    form = param
  }
  var object = {}
  const formData = new FormData(form)
  const objectArrays: any[][] = []
  formData.forEach(function (value, key) {
    if (!value) return
    const path = key.split('.')
    let temp = object
    for (let i = 0; i < path.length; i++) {
      const p = path[i]
      const isLast = i === path.length - 1
      if (isLast) {
        temp[p] = value
      } else if (temp[p]) {
        temp = temp[p]
      } else {
        // se nao houver proximo ou se for alfabetico usa {}
        if (isNaN(+path[i + 1])) {
          temp = temp[p] = {}
        } else {
          const newArray = []
          objectArrays.push(newArray)
          temp = temp[p] = newArray
        }
      }
    }
  })
  objectArrays.forEach((v) => {
    let index = -1
    while ((index = v.findIndex((v) => !v)) != -1) {
      v.splice(index, 1)
    }
  })
  onSubmit(object)
  return false
}

function processLabelText(documentation: string) {
  const text = documentation.startsWith('Informar campo')
    ? documentation
    : ['\n', '.', ':', ' - ', ', ', '(1', '(norma'].reduce(
        (p, c) => p.split(c)[0],
        documentation
      )
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function insertLabel(
  input: HTMLSelectElement | HTMLInputElement,
  documentation: string,
  insertBefore = true
): HTMLLabelElement {
  const label = document.createElement('label')
  label.htmlFor = input.id = createId()
  label.textContent = processLabelText(documentation)
  if (insertBefore) {
    input.before(label)
  } else {
    input.after(label)
  }
  return label
}

export function clearChildren(el: HTMLElement) {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
}

const customHeaders: { name: string; header: string }[] = [
  { name: 'fone', header: 'Telefone' },
  {
    name: 'CFOP',
    header: 'Código Fiscal de Operações e Prestações - CFOP',
  },
  { name: 'CNPJ|CPF', header: 'Documento usado' },
  {
    name: 'cRegTrib',
    header:
      'Código do regime especial de tributação\n1=Microempresa Municipal; 2=Estimativa; 3=Sociedade de Profissionais; 4=Cooperativa; 5=Microempresário Individual (MEI); 6=Microempresário e Empresa de Pequeno Porte',
  },
  {
    name: 'indSomaPISST',
    header: `Indica se o valor do PISST compõe o valor total da NF-e
0=Valor do PISST não compõe o valor total da NF-e
1=Valor do PISST compõe o valor total da NF-e`,
  },
  {
    name: 'indSomaCOFINSST',
    header: `Indica se o valor da COFINS ST compõe o valor total da NF-e
0=Valor da COFINSST não compõe o valor total da NF-e
1=Valor da COFINSST compõe o valor total da NF-e`,
  },
  { name: 'veicTransp|reboque', header: 'Veículo' },
  { name: 'lacres', header: 'Lacres' },
  { name: 'pag', header: 'Informações de Pagamento' },
  {
    name: 'cBenef',
    header: 'Código de Benefício Fiscal na UF aplicado ao item',
  },
  {
    name: 'indTot',
    header: `O valor do item:
0 – Não compõe o valor total da NF-e
1 – Compõe o valor total da NF-e`,
  },
  {
    name: 'CEST|indEscala|CNPJFab',
    header: `Código Especificador da Substituição Tributária`,
  },
  {
    name: 'indEscala',
    header: `Indicador de Produção em escala relevante
S - Produzido em escala relevante
N – Produzido em escala não relevante`,
  },
  {
    name: 'cProdANVISA',
    header: 'Código de Produto da ANVISA',
  },
  {
    name: 'xMotivoIsencao',
    header: 'Motivo da isenção da ANVISA',
  },
  {
    name: 'ICMSUFDest',
    header: 'Dados do ICMS Interestadual',
  },
  { name: 'IPI|ISSQN', header: 'Tributação para serviços' },
  {
    name: 'ICMS|IPI|II',
    header: 'Tributação para produtos',
  },
  {
    name: 'IPI',
    header: 'Imposto sobre produtos industrializados',
  },
  {
    name: 'impostoDevol',
    header: 'Informação do imposto devolvido',
  },
  {
    name: 'pFCP|vFCP',
    header: 'Fundo de combate à pobreza',
  },
  {
    name: 'pFCPST|vFCPST',
    header: 'Fundo de combate à pobreza retido por substituição tributária',
  },
  {
    name: 'pFCPSTRet|vFCPSTRet',
    header:
      'Fundo de combate à pobreza retido anteriormente por substituição tributária',
  },
  {
    name: 'vICMSDeson|motDesICMS',
    header: 'Valor do ICMS/Motiva da desoneração',
  },
  {
    name: 'pRedBCEfet|vBCEfet',
    header: 'Informações do ICMS Efetivo',
  },
  { name: 'pICMS|vICMS', header: 'Informações do ICMS' },
  {
    name: 'pICMSST|vICMSST',
    header: 'Informações do ICMS ST',
  },
  {
    name: 'vBCSTRet|pST|vICMSSubstituto|vICMSSTRet',
    header: 'Informações do ICMS ST cobrado anteriormente',
  },
  {
    name: 'pCredSN|vCredICMSSN',
    header: 'Informações de crédito do ICMS',
  },
  {
    name: 'vBC|pIPI',
    header: 'Cálculo de IPI por alíquota',
  },
  {
    name: 'vBC|pPIS',
    header: 'Cálculo de PIS por alíquota',
  },
  {
    name: 'vBC|pCOFINS',
    header: 'Cálculo de COFINS por alíquota',
  },
  {
    name: 'qUnid|vUnid',
    header: 'Cálculo de IPI por valor de unidade',
  },
  {
    name: 'qBCProd|vAliqProd',
    header: 'Cálculo de por valor de unidade',
  },
  { name: 'IPITrib', header: 'IPI tributado' },
  { name: 'IPINT', header: 'IPI não tributado' },
  { name: 'IPITrib|IPINT', header: 'Tipo de IPI' },
  { name: 'cAgreg', header: 'Código de agregação' },
  { name: 'det', header: 'Produtos ou serviços' },
  {
    name: 'rastro',
    header: 'Detalhamento de produto sujeito a rastreabilidade',
  },
]

export interface IBaseFormElement {
  generate(parent: HTMLElement): HTMLElement
  updateValue(values: any): boolean
  resetValue(): void
  readOnly: boolean
  clone: IBaseFormElement
}

export class genericFormElement implements IBaseFormElement {
  private element: HTMLElement
  public readOnly: boolean

  constructor(el: HTMLElement) {
    this.element = el
  }

  public get clone(): IBaseFormElement {
    const el = new genericFormElement(this.element)
    el.readOnly = this.readOnly
    return el
  }

  public generate(parent: HTMLElement) {
    const element = this.element
    parent.appendChild(element)
    return element
  }

  public updateValue(values: any) {
    return true
  }
  public resetValue() {}
}

const defaultValues: [string, string][] = [
  ['cEAN', 'SEM GTIN'],
  ['cEANTrib', 'SEM GTIN'],
]

abstract class inputFormElement implements IBaseFormElement {
  public name: string[]
  protected documentation: string
  public required: boolean
  public readOnly: boolean

  private generatedElement: HTMLSelectElement | HTMLInputElement

  private _value: string
  public get value(): string {
    return this._value
  }
  public set value(v: string) {
    this._value = v
    const el = this.generatedElement
    if (el) el.value = v ?? ''
  }

  private readonly fixedValue: boolean

  constructor(name: string[], doc: string, req: boolean, value?: string) {
    this.name = name.filter((v) => !v.includes('|'))
    this.documentation = doc
    this.required = req
    if (value) this.value = value
    this.fixedValue = !!value
  }

  protected get nextItemName(): string[] {
    const name = [...this.name]
    const index = name.map((v) => !isNaN(+v)).lastIndexOf(true)
    if (index != -1) name[index] = (+name[index] + 1).toString()
    return name
  }

  public abstract get clone(): IBaseFormElement
  public abstract generate(parent: HTMLElement): HTMLElement

  public updateValue(values: any) {
    if (this.fixedValue) return true
    let hasParent = true
    const value = this.name.reduce((p, c) => {
      if (!p) hasParent = false
      return p?.[c]
    }, values)
    if (value) {
      if (typeof value == 'object') {
        const name = this.name[this.name.length - 1]
        this.value = defaultValues.find((v) => v[0] == name)?.[1]
      } else this.value = value
    }
    return hasParent && (!!value || !this.required)
  }

  public resetValue() {
    this.value = undefined
  }

  protected updateBaseProps(input: HTMLSelectElement | HTMLInputElement) {
    this.generatedElement = input
    if (input instanceof HTMLSelectElement) {
      input.disabled = this.readOnly
    } else {
      input.readOnly = this.readOnly
    }
    input.name = this.name.join('.')
    input.title = this.documentation
    input.required = this.required
    if (this.value) input.value = this.value
  }
}

export class buttonFormElement implements IBaseFormElement {
  private content: string
  private onClick: () => void
  public readOnly: boolean

  constructor(content: string, onClick: () => void) {
    this.content = content
    this.onClick = onClick
  }

  public get clone(): IBaseFormElement {
    const el = new buttonFormElement(this.content, this.onClick)
    el.readOnly = this.readOnly
    return el
  }

  public generate(parent: HTMLElement) {
    if (this.readOnly) return
    const button = document.createElement('button')
    button.textContent = this.content
    button.type = 'button'
    button.onclick = this.onClick
    parent.appendChild(button)
    return button
  }
  public updateValue() {
    return true
  }
  public resetValue() {}
}

export class selectFormElement extends inputFormElement {
  private options: { value: string; text: string }[]

  constructor(
    name: string[],
    documentation: string,
    required: boolean,
    options: { value: string; text: string }[]
  ) {
    super(name, documentation, required)
    this.options = options
  }

  public get clone(): IBaseFormElement {
    const el = new selectFormElement(
      this.nextItemName,
      this.documentation,
      this.required,
      this.options
    )
    el.readOnly = this.readOnly
    return el
  }

  public generate(parent: HTMLElement) {
    const select = document.createElement('select')
    this.options.forEach((v) => {
      const option = document.createElement('option')
      option.value = v.value
      option.text = v.text
      select.appendChild(option)
    })
    this.updateBaseProps(select)
    parent.appendChild(select)
    insertLabel(select, this.documentation)
    return select
  }
}

export class textFormElement extends inputFormElement {
  private options: {
    pattern?: string
    minLength?: number
    maxLength?: number
  }

  constructor(
    name: string[],
    documentation: string,
    required: boolean,
    options: {
      pattern?: string
      minLength?: number
      maxLength?: number
    }
  ) {
    super(name, documentation, required)
    this.options = options
  }

  public get clone(): IBaseFormElement {
    const el = new textFormElement(
      this.nextItemName,
      this.documentation,
      this.required,
      this.options
    )
    el.readOnly = this.readOnly
    return el
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

abstract class baseSelectTextFormElement implements IBaseFormElement {
  protected documentation: string
  protected required: boolean
  protected options: string[]
  protected onChange: (input: HTMLInputElement, isValid: boolean) => void
  protected startValue: string
  public readOnly: boolean

  constructor(
    documentation: string,
    required: boolean,
    options: string[],
    onChange: (input: HTMLInputElement, isValid: boolean) => void
  ) {
    this.documentation = documentation
    this.required = required
    this.options = options
    this.onChange = onChange
  }

  public abstract get clone(): IBaseFormElement

  public generate(parent: HTMLElement) {
    const select = document.createElement('input')
    select.readOnly = this.readOnly
    select.title = this.documentation
    select.required = this.required
    const datalist = document.createElement('datalist')
    this.options.forEach((v) => {
      const option = document.createElement('option')
      option.text = v
      datalist.appendChild(option)
    })
    select.setAttribute('list', (datalist.id = createId()))
    parent.appendChild(select)
    parent.appendChild(datalist)
    insertLabel(select, this.documentation)
    select.onchange = () => {
      const isValid = this.options.some((v) => v == select.value)
      this.onChange(select, isValid)
    }
    select.setCustomValidity(
      this.required && !this.startValue ? 'Selecione um valor.' : ''
    )
    if (this.startValue) select.value = this.startValue
    return select
  }

  public abstract updateValue(values: any): boolean
  public resetValue() {
    this.startValue = undefined
  }
}

export class searchFormElement extends baseSelectTextFormElement {
  private readonly onResult: (value: string) => void

  constructor(
    label: string,
    options: string[],
    onResult: (value: string) => void
  ) {
    super(label, false, options, (select, isValid) => {
      if (isValid) {
        onResult(select.value)
        select.value = ''
      }
    })
    this.onResult = onResult
  }

  public get clone(): IBaseFormElement {
    const el = new searchFormElement(
      this.documentation,
      this.options,
      this.onResult
    )
    el.readOnly = this.readOnly
    return el
  }

  public updateValue(values: any) {
    return true
  }
}

export class selectTextFormElement extends baseSelectTextFormElement {
  private readonly onChangeArg: (value: string) => void
  private getOption: (values: any) => string

  constructor(
    documentation: string,
    required: boolean,
    options: string[],
    onChange: (value: string) => void,
    getOption: (values: any) => string
  ) {
    super(documentation, required, options, (select, isValid) => {
      if (!select.value && !this.required) {
        select.setCustomValidity('')
        onChange(undefined)
      }
      const validity = isValid ? '' : 'Por favor, selecione um valor válido.'
      select.setCustomValidity(validity)
      onChange(isValid ? select.value : undefined)
    })
    this.onChangeArg = onChange
    this.getOption = getOption
  }

  public get clone(): IBaseFormElement {
    const el = new selectTextFormElement(
      this.documentation,
      this.required,
      this.options,
      this.onChangeArg,
      this.getOption
    )
    el.readOnly = this.readOnly
    return el
  }

  public updateValue(values: any) {
    const option = this.getOption(values)
    this.startValue = option
    return !!option
  }
}

export class hiddenFormElement extends inputFormElement {
  constructor(name: string[], required: boolean, value?: string) {
    super(name, '', required, value)
  }

  public get clone(): IBaseFormElement {
    const el = new hiddenFormElement(
      this.nextItemName,
      this.required,
      this.value
    )
    el.readOnly = this.readOnly
    return el
  }

  public generate(parent: HTMLElement) {
    const hidden = document.createElement('input')
    hidden.type = 'hidden'
    this.updateBaseProps(hidden)
    parent.appendChild(hidden)
    return hidden
  }

  public resetValue() {}
}

interface IFieldsetOptions {
  legend: string
  required: boolean
  hidden?: boolean
}

export class fieldsetFormElement implements IBaseFormElement {
  public options: IFieldsetOptions
  public children: IBaseFormElement[]
  private hasInitialValue: boolean
  private _readOnly: boolean
  public get readOnly() {
    return this._readOnly
  }
  public set readOnly(v: boolean) {
    this._readOnly = v
    this.children.forEach((k) => (k.readOnly = v))
  }

  constructor(options: IFieldsetOptions, ...children: IBaseFormElement[]) {
    this.options = options
    this.children = children
    this.hasInitialValue = false
  }

  public get clone(): IBaseFormElement {
    const el = new fieldsetFormElement(
      this.options,
      ...this.children.map((v) => v.clone)
    )
    el.readOnly = this.readOnly
    return el
  }

  public generate(parent: HTMLElement) {
    const createFieldset: () => HTMLFieldSetElement = () => {
      const content = document.createElement('fieldset')
      if (this.options.hidden) {
        content.style.display = 'none'
      }
      if (this.options.legend && this.options.required) {
        const legend = document.createElement('legend')
        legend.textContent = this.options.legend
        content.appendChild(legend)
      }
      this.children.forEach((v) => v.generate(content))
      return content
    }
    if (this.options.required && (this.options.legend || this.options.hidden)) {
      const content = createFieldset()
      parent.appendChild(content)
      return content
    } else if (this.options.required) {
      const content = document.createElement('div')
      this.children.forEach((v) => v.generate(content))
      parent.appendChild(content)
      return content
    } else {
      if (!this.options.legend) {
        console.error('Campo opcional sem legenda!')
        this.options.legend = 'SEM LEGENDA'
      }
      const check = document.createElement('input')
      check.type = 'checkbox'
      check.readOnly = this.readOnly
      check.checked = this.hasInitialValue
      parent.appendChild(check)
      const label = insertLabel(
        check,
        'Informar campo: ' + this.options.legend,
        false
      )
      let fieldset: HTMLFieldSetElement
      const onCheckChange = () => {
        if (check.checked) {
          fieldset = createFieldset()
          label.after(fieldset)
        } else {
          fieldset?.remove()
        }
      }
      check.onchange = () => onCheckChange()
      onCheckChange()
      return fieldset
    }
  }

  public updateValue(values: any) {
    const updates = this.children.map((v) => v.updateValue(values))
    const hasInitialValue = updates.every((v) => v)
    this.hasInitialValue = hasInitialValue
    return hasInitialValue
  }

  public resetValue() {
    this.children.forEach((v) => v.resetValue())
    this.hasInitialValue = false
  }
}

interface IChoiceOption {
  text: string
  view: IBaseFormElement
  name: string[]
}

export class choiceFormElement implements IBaseFormElement {
  private documentation: string
  private isRequired: boolean
  private options: IChoiceOption[]
  private startIndex: number
  public get readOnly() {
    return this.options[1].view.readOnly
  }
  public set readOnly(v: boolean) {
    this.options.filter((k) => k.view).forEach((k) => (k.view.readOnly = v))
  }

  constructor(
    documentation: string,
    isRequired: boolean,
    options: IChoiceOption[]
  ) {
    this.documentation = documentation
    this.isRequired = isRequired
    if (!isRequired) {
      options.unshift({
        text: 'Nenhuma das opções',
        view: undefined,
        name: [],
      })
    }
    this.options = options
    this.startIndex = 0
  }

  public get clone(): IBaseFormElement {
    const el = new choiceFormElement(
      this.documentation,
      this.isRequired,
      this.options.map((v) => {
        return {
          text: v.text,
          view: v.view?.clone,
          name: v.name,
        }
      })
    )
    el.readOnly = this.readOnly
    return el
  }

  public generate(parent: HTMLElement) {
    const select = document.createElement('select')
    if (this.readOnly) select.disabled = true
    const div = document.createElement('div')
    this.options.forEach((v) => {
      const option = document.createElement('option')
      option.text = v.text
      select.appendChild(option)
    })
    const updateView = () => {
      let index = select.selectedIndex
      clearChildren(div)
      const view = this.options[index].view
      if (view instanceof fieldsetFormElement) {
        view.options.legend = ''
      } // remove legenda do fieldset
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
    const indexes: number[] = []
    this.options.some((v, i) => {
      const active = v.view?.updateValue(values) ?? false
      if (active) indexes.push(i)
    })
    this.startIndex = indexes[0]
    return true
  }

  public resetValue() {
    this.startIndex = 0
  }
}

export function getDefaultListNameChanger(name: string) {
  return (v: string[]) => {
    v.splice(v.indexOf(name) + 1, 0, '0')
    return v
  }
}

export class listFormElement implements IBaseFormElement {
  private readonly elArg: fieldsetFormElement
  private content: IBaseFormElement[]
  private container: fieldsetFormElement
  private parentNames: string[]
  private addAction: () => void
  private startValues: any[]
  private startValuesArray: any[]
  public onAddItem: (content: IBaseFormElement[]) => void
  public get readOnly() {
    return this.container.readOnly
  }
  public set readOnly(v: boolean) {
    this.container.readOnly = v
    this.content?.forEach((k) => (k.readOnly = v))
  }

  public set hidden(v: boolean) {
    this.container.options.hidden = v
  }

  constructor(el: fieldsetFormElement, parentNames: string[]) {
    this.elArg = el.clone as fieldsetFormElement
    this.content = el.children
    const add = new buttonFormElement('Adicionar item', () => this.addAction())
    el.children = [add]
    this.container = el
    this.parentNames = parentNames.filter((v) => !v.includes('|'))
    this.startValues = []
    this.startValuesArray = []
  }

  public get clone(): IBaseFormElement {
    const newList = new listFormElement(
      this.elArg.clone as fieldsetFormElement,
      this.parentNames
    )
    newList.onAddItem = this.onAddItem
    newList.readOnly = this.readOnly
    return newList
  }

  public generate(parent: HTMLElement) {
    const container = this.container.generate(parent)
    const addItem = (content?: any) => {
      const details = document.createElement('details')
      details.open = true
      const summary = document.createElement('summary')
      summary.textContent = 'Item'
      details.appendChild(summary)
      const newContent = [...this.content]
      if (content) newContent.forEach((v) => v.updateValue(content))
      this.onAddItem?.(newContent)
      const remover = new buttonFormElement('Remover item', () =>
        details.remove()
      )
      newContent.push(remover)
      newContent.forEach((v) => v.generate(details))
      this.content = this.content.map((v) => v.clone)
      container.appendChild(details)
    }
    this.addAction = () => addItem()
    this.startValuesArray.forEach((v) => addItem(this.startValues))
    return container
  }

  public updateValue(values: any) {
    let baseValueParent = undefined
    const baseValue = this.parentNames.reduce((p, c) => {
      baseValueParent = p
      return p?.[c]
    }, values)
    if (baseValue) {
      if (!Array.isArray(baseValue)) {
        if (!baseValueParent) return false
        const lastName = this.parentNames[this.parentNames.length - 1]
        baseValueParent[lastName] = this.startValuesArray = [baseValue]
      } else this.startValuesArray = baseValue
      this.startValues = values
      return true
    }
    //Corrigir aqui pra remover a alteração pra array no nfe.ts
    return false
  }

  public resetValue() {
    this.startValues = []
  }
}

interface ISpecificFormFields {
  names: string[]
  addIgnoreFields: string[]
  getNewFields: (
    parentTags: string[],
    getField: (name: string) => any
  ) => IBaseFormElement[]
}

function getDocumentation(v: any): string {
  const name = getName(v)
  const fromScheme = v['xs:annotation']?.['xs:documentation']
  if (name) {
    const custom = customHeaders.find((v) => name === v.name)?.header
    const nameParts = name.split('|')
    return (
      custom ??
      fromScheme ??
      customHeaders.find((v) => {
        const customParts = v.name.split('|')
        return customParts.every((k) => nameParts.includes(k))
      })?.header ??
      ''
    )
  }
  return fromScheme ?? ''
}

function getName(v: any): string {
  const name = v.name
  if (!name && typeof v == 'object') {
    const isRootList = 'length' in v
    if (isRootList || v['xs:element']) {
      const listParent = isRootList ? v : v['xs:element']
      return listParent.map(getName).join('|')
    }
  }
  return name
}

function findField(
  rootField: any,
  name: string,
  parentNames: string[] = [],
  parentTag: string = '',
  lvl = 0
): { tag: string; parentNames: string[]; field: any } {
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
        field,
      }
    } else if (lvl < 5) {
      const searchParentNames = fieldName
        ? [...parentNames, fieldName]
        : parentNames
      const search = findField(field, name, searchParentNames, index, lvl + 1)
      if (search) return search
    }
  }
}

interface IGenerateViewOptions {
  customRequireds?: string[]
  customOptions?: {
    firstOption: string
    optionsChanger: (options: IChoiceOption[]) => void
  }[]
  rootTag?: string
  parentTags?: string[]
}

interface IGenerateViewsOptions {
  customRequireds?: string[]
  parentNames?: string[]
}

export class defaultForm {
  static rootNFe =
    nfeSchema['xs:schema']['xs:complexType'][0]['xs:sequence']['xs:element'][0]
  static elementosNFe =
    defaultForm.rootNFe['xs:complexType']['xs:sequence']['xs:element']

  public elements: IBaseFormElement[]

  constructor(...elements: IBaseFormElement[]) {
    this.elements = elements
  }

  static generateViews(
    rootField: any,
    options: IGenerateViewsOptions,
    ...names: string[]
  ) {
    return names.flatMap((name) => {
      const field = findField(rootField, name)
      return defaultForm.generateView(field.field, {
        customRequireds: options.customRequireds ?? [],
        rootTag: field.tag,
        parentTags: options.parentNames
          ? [...options.parentNames, ...field.parentNames]
          : field.parentNames,
      })
    })
  }

  static generateView(
    rootField: any,
    options?: IGenerateViewOptions
  ): IBaseFormElement[] {
    const customOptions = options?.customOptions ?? []
    const customRequireds = options?.customRequireds ?? []
    const rootTag = options?.rootTag
    const parentTags = options?.parentTags ?? []
    let additionalNameChanger: ((names: string[]) => string[])[] = []
    const customNameChanger = (names: string[]) =>
      additionalNameChanger.forEach((v) => v(names))

    function isRequired(v: any): boolean {
      if (customRequireds.includes(getName(v))) return true
      const element = v['xs:element']
      if (element && Array.isArray(element)) {
        const required = element.every(
          (k) => isRequired(k) || customRequireds.includes(getName(k))
        )
        if (!required) return false
      }
      const seq = v['xs:sequence']
      if (seq) {
        const sequence = Array.isArray(seq) ? seq : (seq['xs:element'] as any[])
        const required = sequence.every(
          (k) => isRequired(k) || customRequireds.includes(getName(k))
        )
        if (!required) return false
      }
      return (v.minOccurs ?? 1) > 0
    }

    function createInput(field: any, parentTags: string[]): IBaseFormElement {
      const fieldRestriction = field['xs:simpleType']?.['xs:restriction']
      const baseType = field.type ?? fieldRestriction?.base
      const findType = (v: any) => getName(v) == baseType
      const hasOtherRestrictions =
        baseType != 'xs:string' && baseType != 'xs:base64Binary'
      const otherRestrictions: any = (simpleTypes.find(findType) as any)?.[
        'xs:restriction'
      ]
      if (hasOtherRestrictions && !otherRestrictions) {
        const complexType =
          field['xs:complexType'] ?? complexTypes.find(findType)
        if (!complexType) {
          const element = field['xs:element']
          if (!element) {
            console.log(field)
            throw new Error('Invalid field')
          }
          return createFieldset(field, parentTags)
        }
        const newField = {
          ...field,
          'xs:complexType': complexType,
        }
        return createFieldset(newField, parentTags)
      }
      if (hasOtherRestrictions && otherRestrictions?.base != 'xs:string') {
        console.log(otherRestrictions)
        throw new Error('The other restrictions have a invalid base.')
      }
      const enumeration =
        fieldRestriction?.['xs:enumeration'] ??
        otherRestrictions?.['xs:enumeration']
      const name = [...parentTags, getName(field)]
      customNameChanger?.(name)
      const required = isRequired(field)
      const documentation = getDocumentation(field)
      if (!enumeration) {
        const getProp = (el: string) => {
          const fieldProp = fieldRestriction?.[el]?.value
          const otherProp = otherRestrictions?.[el]?.value
          return fieldProp ?? otherProp
        }
        return new textFormElement(name, documentation, required, {
          pattern: getProp('pattern'),
          minLength: getProp('minLength'),
          maxLength: getProp('maxLength'),
        })
      }
      if (!('length' in enumeration)) {
        const val = enumeration.value
        return new hiddenFormElement(name, required, val)
      }
      const val0 = enumeration[0].value
      const val1 = enumeration[1].value.toUpperCase()
      if (enumeration.length == 2 && val0.toUpperCase() == val1)
        return new hiddenFormElement(name, required, val0)
      const values = (enumeration as any[]).map((v) => v.value)
      const getValueDescription = (v: string) => {
        if (isNaN(+v) && v.length > 1) return v
        const getIndex = (search: string) => documentation.indexOf(search)
        const getIndexEnd = (mark: string, pos: number) =>
          documentation.indexOf(mark, pos)
        const starts = v.includes('.00')
          ? [getIndex(v.replace('.00', '%'))]
          : ['-', ' -', '  –', ' –', '–', '=', ' =']
              .map((k) => getIndex(v + k))
              .filter((v) => v != -1)
        if (starts.length == 0) return v
        const start = Math.min(...starts)
        const ends = [';', '.', ')', '\n']
          .map((k) => getIndexEnd(k, start))
          .filter((k) => k != -1)
        if (ends.length == 0) {
          return documentation.substring(start)
        }
        let end = Math.min(...ends)
        return documentation.substring(start, end)
      }
      const getOption = (v: any, processDescription: boolean = true) => {
        return {
          value: v,
          text: processDescription ? getValueDescription(v) : v,
        }
      }
      const firstOption = getOption(values[0])
      const optionsHaveDescriptions = firstOption.text != firstOption.value
      const otherValues = values.slice(1)
      let stopValuesMap = false
      const otherOptions = optionsHaveDescriptions
        ? otherValues
            .map((v) => {
              if (stopValuesMap) return undefined
              const opt = getOption(v, true)
              if (opt.value == opt.text) {
                stopValuesMap = true
                return undefined
              }
              return opt
            })
            .filter((v) => v)
        : otherValues.map((v) => getOption(v, false))
      const completeOptions = [firstOption, ...otherOptions]
      return new selectFormElement(
        name,
        documentation,
        required,
        completeOptions
      )
    }

    function createChoice(field: any, parentTags: string[]): IBaseFormElement {
      const elements = field['xs:element'] as any[]
      const sequence = field['xs:sequence']
      if (!elements && !sequence) {
        throw new Error('Choice invalido')
      }
      let options: IChoiceOption[] = []
      if (elements) {
        options.push(
          ...elements.map((v) => {
            return {
              text: getDocumentation(v),
              view: createInput(v, parentTags),
              name: [...parentTags, getName(v)],
            }
          })
        )
      }
      if (sequence) {
        if (options.length > 0) {
          options.push({
            text: getDocumentation(sequence),
            view: createFieldset(sequence, parentTags),
            name: [...parentTags, getName(sequence)],
          })
        } else {
          const array = Array.isArray(sequence)
            ? sequence
            : (sequence['xs:element'] as any[])
          options.push(
            ...array.map((v) => {
              return {
                text: getDocumentation(v),
                view: createInput(v, parentTags),
                name: [...parentTags, getName(v)],
              }
            })
          )
        }
      }
      const doc = getDocumentation(field)
      const req = isRequired(field)
      customOptions
        .find((v) => v.firstOption == options[0].text)
        ?.optionsChanger(options)
      return new choiceFormElement(doc, req, options)
    }

    function createFieldset(
      field: any,
      parentTags: string[]
    ): IBaseFormElement {
      const legend = processLabelText(getDocumentation(field))
      const name = getName(field)
      const isRootList = 'length' in field
      const max = field?.maxOccurs ?? 1
      const isList = max > 1
      if (isList) additionalNameChanger.push(getDefaultListNameChanger(name))
      const tags = name ? [...parentTags, name] : parentTags
      const required = max > 1 || isRequired(field)
      const fields: IBaseFormElement[] = []
      if (isRootList || field['xs:element']) {
        const elements = (isRootList ? field : field['xs:element']) as any[]
        fields.push(...elements.map((v) => createInput(v, tags)))
      }
      if (field['xs:complexType'] || field['xs:sequence']) {
        const sequence =
          field['xs:complexType']?.['xs:sequence'] ?? field['xs:sequence']
        if (sequence) {
          if (fields.length == 0) {
            const pureFields = Object.entries(sequence)
            fields.push(
              ...pureFields.flatMap((v) => analyseTag(v[0], v[1], tags))
            )
          } else fields.push(createFieldset(sequence, tags))
        }
        const choice = field['xs:complexType']?.['xs:choice']
        if (choice) {
          fields.push(createChoice(choice, tags))
        }
      }
      if (!fields.length) {
        console.log(field)
        throw new Error('Invalid tag for a fieldset')
      }
      const fieldset = new fieldsetFormElement({ legend, required }, ...fields)
      if (isList) additionalNameChanger.pop()
      return isList ? new listFormElement(fieldset, tags) : fieldset
    }

    function createCityField(
      parentTags: string[],
      getField: (name: string) => any
    ): IBaseFormElement[] {
      const genEl = (name: string) => {
        const field = getField(name)
        return field
          ? new hiddenFormElement([...parentTags, name], isRequired(field))
          : undefined
      }
      const cMun = genEl('cMun'),
        cMunFG = genEl('cMunFG'),
        xMun = genEl('xMun'),
        UF = genEl('UF'),
        cUF = genEl('cUF')
      if (!cMun && !cMunFG && !xMun)
        throw new Error('City field without cMun and xMun.')

      const mun2str = (mun: string, uf: string) => `${mun} (${uf})`
      const municipio = new selectTextFormElement(
        'Município',
        cMun?.required || cMunFG?.required || xMun?.required,
        IBGE.flatMap((v) => v.Municipios.map((k) => mun2str(k.Nome, v.Sigla))),
        (value) => {
          if (value) {
            const startUF = value.indexOf('('),
              uf = value.substring(startUF + 1, value.length - 1),
              ufIBGE = IBGE.find((v) => v.Sigla == uf),
              mun = value.substring(0, startUF - 1),
              munIBGE = ufIBGE?.Municipios.find((v) => v.Nome == mun)
            if (munIBGE) {
              if (cMun) cMun.value = munIBGE.Codigo
              if (cMunFG) cMunFG.value = munIBGE.Codigo
              if (xMun) xMun.value = munIBGE.Nome
              if (UF) UF.value = ufIBGE.Sigla
              if (cUF) cUF.value = ufIBGE.Codigo
              console.log(cMun, cMunFG, xMun, UF, cUF)
              return
            }
          }
          if (cMun) cMun.value = undefined
          if (cMunFG) cMunFG.value = undefined
          if (xMun) xMun.value = undefined
          if (UF) UF.value = undefined
          if (cUF) cUF.value = undefined
        },
        (values) => {
          const filteredNames = parentTags.filter((v) => !v.includes('|'))
          const baseValue = filteredNames.reduce((p, c) => p?.[c], values)
          if (!baseValue) return undefined
          const cUFValue = baseValue['cUF']
          const ufValue = baseValue['UF']
          const cMunValue = baseValue['cMun'] ?? baseValue['cMunFG']
          const xMunValue = baseValue['xMun']
          if (cMunValue || xMunValue) {
            const uf = cUFValue
              ? IBGE.find((v) => v.Codigo == cUFValue)
              : ufValue
              ? IBGE.find((v) => v.Sigla.toUpperCase() == ufValue.toUpperCase())
              : cMunValue
              ? IBGE.find((v) =>
                  v.Municipios.some((k) => k.Codigo == cMunValue)
                )
              : IBGE.find((v) =>
                  v.Municipios.some(
                    (k) => k.Nome.toUpperCase() == xMunValue.toUpperCase()
                  )
                )
            if (!uf) return undefined
            const munValue = cMunValue
              ? uf.Municipios.find((v) => v.Codigo === cMunValue)
              : uf.Municipios.find(
                  (k) => k.Nome.toUpperCase() == xMunValue.toUpperCase()
                )
            return mun2str(munValue.Nome, uf.Sigla)
          }
          console.log(baseValue)
          return undefined
        }
      )
      return [cMun, cMunFG, xMun, cUF, UF, municipio].filter((v) => v)
    }

    function createStateField(
      parentTags: string[],
      getField: (name: string) => any
    ): IBaseFormElement[] {
      const genEl = (name: string) => {
        const field = getField(name)
        return field
          ? new hiddenFormElement([...parentTags, name], isRequired(field))
          : undefined
      }
      const cUF = genEl('cUF'),
        UF = genEl('UF')
      if (!cUF && !UF) throw new Error('State field without cUF and UF.')

      const uf = new selectTextFormElement(
        'Estado',
        cUF?.required || UF?.required,
        IBGE.map((v) => v.Nome),
        (value) => {
          const uf = IBGE.find((v) => v.Nome == value)
          if (cUF) cUF.value = uf?.Codigo
          if (UF) UF.value = uf?.Sigla
        },
        (values) => {
          const filteredNames = parentTags.filter((v) => !v.includes('|'))
          const baseValue = filteredNames.reduce((p, c) => p?.[c], values)
          if (!baseValue) return undefined
          const cUFValue = baseValue['cUF']
          const ufValue = baseValue['UF']
          if (cUFValue || ufValue) {
            const uf = cUFValue
              ? IBGE.find((v) => v.Codigo == cUFValue)
              : IBGE.find((v) => v.Sigla.toUpperCase() == ufValue.toUpperCase())
            return uf?.Nome
          }
          return undefined
        }
      )
      return [cUF, UF, uf].filter((v) => v)
    }

    function createCountryField(
      parentTags: string[],
      getField: (name: string) => any
    ): IBaseFormElement[] {
      const genEl = (name: string) => {
        const field = getField(name)
        return field
          ? new hiddenFormElement([...parentTags, name], isRequired(field))
          : undefined
      }
      const cPais = genEl('cPais'),
        xPais = genEl('xPais')
      if (!cPais && !xPais)
        throw new Error('Country field without cPais and xPais.')

      const pais = new selectTextFormElement(
        'País',
        cPais?.required || xPais?.required,
        paises.map((k) => k.nome),
        (value) => {
          const pais = paises.find((v) => v.nome == value)
          if (xPais) xPais.value = pais?.nome
          if (cPais) cPais.value = pais?.codigo
        },
        (values) => {
          const filteredNames = parentTags.filter((v) => !v.includes('|'))
          const baseValue = filteredNames.reduce((p, c) => p?.[c], values)
          if (!baseValue) return undefined
          const cPais = baseValue['cPais']
          const xPais = baseValue['xPais']
          if (cPais || xPais) {
            const uf = cPais
              ? paises.find((v) => v.codigo == cPais)
              : paises.find((v) => v.nome.toUpperCase() == xPais.toUpperCase())
            return uf?.nome
          }
          return undefined
        }
      )
      return [cPais, xPais, pais].filter((v) => v)
    }

    function createElements(field: any, parentTags: string[]) {
      const elements = 'length' in field ? (field as any[]) : [field]
      const specificFields: ISpecificFormFields[] = [
        {
          names: ['cMun', 'xMun', 'cMunFG'],
          addIgnoreFields: ['cUF', 'UF'],
          getNewFields: createCityField,
        },
        {
          names: ['cUF', 'UF'],
          addIgnoreFields: [],
          getNewFields: createStateField,
        },
        {
          names: ['cPais', 'xPais'],
          addIgnoreFields: [],
          getNewFields: createCountryField,
        },
      ]
      const ignoreFields: string[] = []
      return elements
        .flatMap((v) => {
          const name = getName(v)
          if (ignoreFields.includes(name)) return undefined
          const input = createInput(v, parentTags)
          const specific = specificFields.find((k) => k.names.includes(name))
          if (specific && !(input instanceof hiddenFormElement)) {
            ignoreFields.push(...specific.names, ...specific.addIgnoreFields)
            return specific.getNewFields(parentTags, (name) =>
              elements.find((v) => getName(v) == name)
            )
          } // Se o valor for um hidden então ele não deve ser substituido
          return input
        })
        .filter((v) => v)
    }

    function analyseTag(
      tag: string,
      field: any,
      parentTags: string[]
    ): IBaseFormElement[] {
      switch (tag) {
        case 'xs:choice':
          return [createChoice(field, parentTags)]
        case 'xs:element':
          return createElements(field, parentTags)
        default:
          if (!tag || tag == 'xs:sequence')
            return [createFieldset(field, parentTags)]
          console.trace('Invalid tag', tag, field)
          return []
      }
    }

    return analyseTag(rootTag, rootField, parentTags)
  }
  public generateForm(onSubmit: (data: any) => void): HTMLFormElement
  public generateForm(actions: IFormAction[]): HTMLFormElement
  public generateForm(
    params: ((data: any) => void) | IFormAction[]
  ): HTMLFormElement {
    const form = document.createElement('form')
    this.elements.forEach((v) => v.generate(form))
    const createSub = (
      action: (data: any) => void,
      text: string = 'Enviar'
    ) => {
      const btn = document.createElement('button')
      if (text) btn.textContent = text
      // btn.type = 'button' Ainda queremos a validação do form
      btn.onclick = () => defaultFormSubmit(action, form)
      form.appendChild(btn)
    }
    if (params) {
      if (Array.isArray(params)) {
        params.forEach((v) => createSub(v.task, v.label))
      } else {
        createSub(params)
      }
    }
    form.onsubmit = (e) => {
      e.preventDefault()
      console.log('Submissão ignorada.')
      return false
    }
    return form
  }

  public updateValue(values: any) {
    this.elements.forEach((v) => v.updateValue(values))
  }

  public resetValue() {
    this.elements.forEach((v) => v.resetValue())
  }
}

export interface IFormAction {
  label: string
  task: (data: any) => void
}
