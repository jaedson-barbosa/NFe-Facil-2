import * as basicSchema from './data/basic.json'
import * as nfeSchema from './data/nfe.json'
import { IBGE } from './data/IBGE.json'
import { paises } from './data/paises.json'
import { processLabelText } from './processLabelText'
import {
  listFormElement,
  selectFormElement,
  choiceFormElement,
  fieldsetFormElement,
  hiddenFormElement,
  selectTextFormElement,
  textFormElement,
} from './form-elements'
import { getName } from './getName'
import { IChoiceOption } from './IChoiceOption'
import { IBaseFormElement } from './form-elements/IBaseFormElement'

export function generateView(
  rootField: any,
  optionsInstance?: IGenerateViewOptions
): IBaseFormElement[] {
  const customOptions = optionsInstance?.customOptions ?? []
  const customRequireds = optionsInstance?.customRequireds ?? []
  const additionalNameChanger: ((names: string[]) => string[])[] = []
  const customNameChanger = (names: string[]) =>
    additionalNameChanger.forEach((v) => v(names))
  const creationOptions: IElementCreationOptions = {
    customOptions,
    customRequireds,
    additionalNameChanger,
    customNameChanger,
  }
  return analyseTag(
    optionsInstance?.rootTag,
    rootField,
    optionsInstance?.parentTags ?? [],
    creationOptions
  )
}

interface ISpecificFormFields {
  names: string[];
  addIgnoreFields: string[];
  getNewFields: (
    parentTags: string[],
    getField: (name: string) => any
  ) => IBaseFormElement[];
}

interface IGenerateViewOptions {
  customRequireds?: string[];
  customOptions?: {
    firstOption: string;
    optionsChanger: (options: IChoiceOption[]) => void;
  }[];
  rootTag?: string;
  parentTags?: string[];
}

function getDocumentation(v: any): string {
  const name = getName(v);
  const fromScheme = v['xs:annotation']?.['xs:documentation'];
  if (name) {
    const custom = customHeaders.find((v) => name === v.name)?.header;
    const nameParts = name.split('|');
    return (
      custom ??
      fromScheme ??
      customHeaders.find((v) => {
        const customParts = v.name.split('|');
        return customParts.every((k) => nameParts.includes(k));
      })?.header ??
      ''
    );
  }
  return fromScheme ?? '';
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

function getDefaultListNameChanger(name: string) {
  return (v: string[]) => {
    v.splice(v.indexOf(name) + 1, 0, '0');
    return v;
  };
}

function isRequired(
  v: any,
  creationOptions?: IElementCreationOptions
): boolean {
  const customRequireds = creationOptions?.customRequireds ?? []
  if (customRequireds.includes(getName(v))) return true
  const element = v['xs:element']
  if (element && Array.isArray(element)) {
    const required = element.every(
      (k) =>
        customRequireds.includes(getName(k)) || isRequired(k, creationOptions)
    )
    if (!required) return false
  }
  const seq = v['xs:sequence']
  if (seq) {
    const sequence = Array.isArray(seq) ? seq : (seq['xs:element'] as any[])
    const required = sequence.every(
      (k) =>
        customRequireds.includes(getName(k)) || isRequired(k, creationOptions)
    )
    if (!required) return false
  }
  return (v.minOccurs ?? 1) > 0
}

function createInput(
  field: any,
  parentTags: string[],
  creationOptions: IElementCreationOptions
): IBaseFormElement {
  const fieldRestriction = field['xs:simpleType']?.['xs:restriction']
  const baseType = field.type ?? fieldRestriction?.base
  const findType = (v: any) => getName(v) == baseType
  const hasOtherRestrictions =
    baseType != 'xs:string' && baseType != 'xs:base64Binary'
  const otherRestrictions: any = (simpleTypes.find(findType) as any)?.[
    'xs:restriction'
  ]
  if (hasOtherRestrictions && !otherRestrictions) {
    const complexType = field['xs:complexType'] ?? complexTypes.find(findType)
    if (!complexType) {
      const element = field['xs:element']
      if (!element) {
        console.log(field)
        throw new Error('Invalid field')
      }
      return createFieldset(field, parentTags, creationOptions)
    }
    const newField = {
      ...field,
      'xs:complexType': complexType,
    }
    return createFieldset(newField, parentTags, creationOptions)
  }
  if (hasOtherRestrictions && otherRestrictions?.base != 'xs:string') {
    console.log(otherRestrictions)
    throw new Error('The other restrictions have a invalid base.')
  }
  const enumeration =
    fieldRestriction?.['xs:enumeration'] ??
    otherRestrictions?.['xs:enumeration']
  const name = [...parentTags, getName(field)]
  creationOptions.customNameChanger?.(name)
  const required = isRequired(field, creationOptions)
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
  return new selectFormElement(name, documentation, required, completeOptions)
}

function createChoice(
  field: any,
  parentTags: string[],
  creationOptions: IElementCreationOptions
): IBaseFormElement {
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
          view: createInput(v, parentTags, creationOptions),
          name: [...parentTags, getName(v)],
        }
      })
    )
  }
  if (sequence) {
    if (options.length > 0) {
      options.push({
        text: getDocumentation(sequence),
        view: createFieldset(sequence, parentTags, creationOptions),
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
            view: createInput(v, parentTags, creationOptions),
            name: [...parentTags, getName(v)],
          }
        })
      )
    }
  }
  const doc = getDocumentation(field)
  const req = isRequired(field, creationOptions)
  creationOptions.customOptions
    .find((v) => v.firstOption == options[0].text)
    ?.optionsChanger(options)
  return new choiceFormElement(doc, req, options)
}

function createFieldset(
  field: any,
  parentTags: string[],
  creationOptions: IElementCreationOptions
): IBaseFormElement {
  const legend = processLabelText(getDocumentation(field))
  const name = getName(field)
  const isRootList = 'length' in field
  const max = field?.maxOccurs ?? 1
  const isList = max > 1
  if (isList) {
    creationOptions.additionalNameChanger.push(getDefaultListNameChanger(name))
  }
  const tags = name ? [...parentTags, name] : parentTags
  const required = max > 1 || isRequired(field, creationOptions)
  const fields: IBaseFormElement[] = []
  if (isRootList || field['xs:element']) {
    const elements = (isRootList ? field : field['xs:element']) as any[]
    fields.push(...elements.map((v) => createInput(v, tags, creationOptions)))
  }
  if (field['xs:complexType'] || field['xs:sequence']) {
    const sequence =
      field['xs:complexType']?.['xs:sequence'] ?? field['xs:sequence']
    if (sequence) {
      if (fields.length == 0) {
        const pureFields = Object.entries(sequence)
        fields.push(
          ...pureFields.flatMap((v) =>
            analyseTag(v[0], v[1], tags, creationOptions)
          )
        )
      } else fields.push(createFieldset(sequence, tags, creationOptions))
    }
    const choice = field['xs:complexType']?.['xs:choice']
    if (choice) {
      fields.push(createChoice(choice, tags, creationOptions))
    }
  }
  if (!fields.length) {
    console.log(field)
    throw new Error('Invalid tag for a fieldset')
  }
  const fieldset = new fieldsetFormElement({ legend, required }, ...fields)
  if (isList) {
    creationOptions.additionalNameChanger.pop()
  }
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

function createElements(
  field: any,
  parentTags: string[],
  creationOptions: IElementCreationOptions
) {
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
      const input = createInput(v, parentTags, creationOptions)
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
  parentTags: string[],
  creationOptions: IElementCreationOptions
): IBaseFormElement[] {
  switch (tag) {
    case 'xs:choice':
      return [createChoice(field, parentTags, creationOptions)]
    case 'xs:element':
      return createElements(field, parentTags, creationOptions)
    default:
      if (!tag || tag == 'xs:sequence')
        return [createFieldset(field, parentTags, creationOptions)]
      console.trace('Invalid tag', tag, field)
      return []
  }
}

interface IElementCreationOptions {
  customRequireds: string[]
  customOptions: {
    firstOption: string
    optionsChanger: (options: IChoiceOption[]) => void
  }[]
  additionalNameChanger: ((names: string[]) => string[])[]
  customNameChanger: (names: string[]) => void
}

const complexTypes = nfeSchema['xs:schema']['xs:complexType']
const simpleTypes = [
  ...basicSchema['xs:schema']['xs:simpleType'],
  ...nfeSchema['xs:schema']['xs:simpleType'],
]
