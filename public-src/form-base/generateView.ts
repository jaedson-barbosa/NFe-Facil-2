import * as nfeSchema from './data/nfe.json'
import { IBGE } from './data/IBGE.json'
import { paises } from './data/paises.json'
import {
  listFormElement,
  selectFormElement,
  choiceFormElement,
  fieldsetFormElement,
  hiddenFormElement,
  selectTextFormElement,
  textFormElement,
} from './form-elements'
import { IChoiceOption } from './IChoiceOption'
import { IBaseFormElement } from './form-elements/IBaseFormElement'

export function generateView(
  rootField: any,
  optionsInstance?: IGenerateViewOptions
): IBaseFormElement {
  const customOptions = optionsInstance?.customOptions ?? []
  const additionalNameChanger: ((names: string[]) => string[])[] = []
  const customNameChanger = (names: string[]) =>
    additionalNameChanger.forEach((v) => v(names))
  const creationOptions: IElementCreationOptions = {
    customOptions,
    additionalNameChanger,
    customNameChanger,
  }
  return createInput(
    rootField,
    optionsInstance?.parentTags ?? [],
    creationOptions
  )
}

interface ISpecificFormFields {
  names: string[]
  addIgnoreFields: string[]
  getNewFields: (
    parentTags: string[],
    getField: (name: string) => any
  ) => IBaseFormElement[]
}

interface IGenerateViewOptions {
  customOptions?: {
    firstOption: string
    optionsChanger: (options: IChoiceOption[]) => void
  }[]
  parentTags?: string[]
}

function getDocumentation(v: any): { label: string; aux: string } {
  let label = v.annotation?.label
  if (label) {
    const aux = v.annotation?.aux
    if (aux) label += ' *'
    return { label, aux }
  }
  // if (!doc) console.log(v)
  return undefined
}

const complex = nfeSchema.complexType
const simple = nfeSchema.simpleType

function createInput(
  field: any,
  parentTags: string[],
  creationOptions: IElementCreationOptions
): IBaseFormElement {
  if (field.choice || field.element) {
    return createFieldset(field, parentTags, creationOptions)
  }
  const findType = (v: any) => v.name == field.type
  const restriction = (field.simpleType ?? simple.find(findType))?.restriction
  if (!restriction) {
    const complexType = complex.find(findType)
    if (!complexType) throw new Error('Invalid field')
    const newField = { ...complexType, ...field }
    return createFieldset(newField, parentTags, creationOptions)
  }
  const enumeration = restriction.enumeration
  const name = [...parentTags, field.name]
  creationOptions.customNameChanger?.(name)
  const required = !field.optional
  const documentation = getDocumentation(field)
  if (enumeration) {
    if (typeof enumeration == 'string') {
      return new hiddenFormElement(name, required, enumeration)
    }
    const itensDescriptions = field.annotation.itens
    return new selectFormElement(
      name,
      documentation,
      required,
      (enumeration as any[]).map((v, i) => {
        const text = itensDescriptions ? v + ' - ' + itensDescriptions[i] : v
        return { value: v, text }
      })
    )
  } else {
    let type = 'text'
    if (field.name == 'fone') {
      type = 'tel'
    } else if (field.name == 'email') {
      type = 'email'
    } else if (field.type == 'TData') {
      type = 'date'
    } else if (!/[a-zA-Z]|ÿ/.test(restriction.pattern)) {
      type = 'number'
    }
    return new textFormElement(name, documentation, required, {
      pattern: restriction.pattern,
      minLength: restriction.minLength,
      maxLength: restriction.maxLength,
      type,
      decimal: restriction.decimal,
    })
  }
}

function createChoice(
  field: any,
  parentTags: string[],
  creationOptions: IElementCreationOptions
): IBaseFormElement {
  const elements = field['element'] as any[]
  if (!elements) throw new Error('Choice invalido')
  let options: IChoiceOption[] = elements.map((v) => {
    return {
      text: getDocumentation(v),
      view: createInput(v, parentTags, creationOptions),
      name: [...parentTags, v.name],
    }
  })
  creationOptions.customOptions
    .find((v) => v.firstOption == options[0].text.label)
    ?.optionsChanger(options)
  return new choiceFormElement(
    getDocumentation(field),
    !field.optional,
    options
  )
}

function createFieldset(
  field: any,
  parentTags: string[],
  creationOptions: IElementCreationOptions
): IBaseFormElement {
  const name = field.name
  const isRootList = 'length' in field
  if (field.maxOccurs) {
    creationOptions.additionalNameChanger.push((v: string[]) => {
      v.splice(v.indexOf(name) + 1, 0, '0')
      return v
    })
  }
  const tags = name ? [...parentTags, name] : parentTags
  const fields: IBaseFormElement[] = []
  if (isRootList || field['element']) {
    const elements = (isRootList ? field : field['element']) as any[]
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
    fields.push(
      ...elements
        .flatMap((v) => {
          const name = v.name
          if (ignoreFields.includes(name)) return undefined
          const input = createInput(v, tags, creationOptions)
          const specific = specificFields.find((k) => k.names.includes(name))
          if (specific && !(input instanceof hiddenFormElement)) {
            ignoreFields.push(...specific.names, ...specific.addIgnoreFields)
            return specific.getNewFields(tags, (name) =>
              elements.find((v) => v.name == name)
            )
          } // Se o valor for um hidden então ele não deve ser substituido
          return input
        })
        .filter((v) => v)
    )
  } else if (field.choice) {
    fields.push(createChoice(field.choice, tags, creationOptions))
  }
  if (fields.length == 0) {
    console.log(field)
    throw new Error('Invalid fieldset')
  }
  const fieldset = new fieldsetFormElement(
    {
      legend: getDocumentation(field),
      required: field.maxOccurs || !field.optional,
    },
    ...fields
  )
  if (field.maxOccurs) {
    creationOptions.additionalNameChanger.pop()
    return new listFormElement(fieldset, tags)
  } else return fieldset
}

function createCityField(
  parentTags: string[],
  getField: (name: string) => any
): IBaseFormElement[] {
  const genEl = (name: string) => {
    const field = getField(name)
    return field
      ? new hiddenFormElement([...parentTags, name], !field.optional)
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
    { label: 'Município' },
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
          ? IBGE.find((v) => v.Municipios.some((k) => k.Codigo == cMunValue))
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
      ? new hiddenFormElement([...parentTags, name], !field.optional)
      : undefined
  }
  const cUF = genEl('cUF'),
    UF = genEl('UF')
  if (!cUF && !UF) throw new Error('State field without cUF and UF.')

  const uf = new selectTextFormElement(
    { label: 'Estado' },
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
      ? new hiddenFormElement([...parentTags, name], !field.optional)
      : undefined
  }
  const cPais = genEl('cPais'),
    xPais = genEl('xPais')
  if (!cPais && !xPais)
    throw new Error('Country field without cPais and xPais.')

  const pais = new selectTextFormElement(
    { label: 'País' },
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

interface IElementCreationOptions {
  customOptions: {
    firstOption: string
    optionsChanger: (options: IChoiceOption[]) => void
  }[]
  additionalNameChanger: ((names: string[]) => string[])[]
  customNameChanger: (names: string[]) => void
}
