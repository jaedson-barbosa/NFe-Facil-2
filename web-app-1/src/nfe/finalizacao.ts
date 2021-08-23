import IBGE from '../app/IBGE'
import refInfNFe from './nfe'
import toXml from './json2xml'
import type INFeRoot from './INFeRoot'

export function preparateJSON(infNFe: INFeRoot) {
  const cUF = IBGE.find(
    (v) => v.Sigla == (infNFe.emit.enderEmit.UF as string)
  )!.Codigo
  const dhEmi = new Date(infNFe.ide.dhEmi)
  const AAMM =
    dhEmi.getFullYear().toString().slice(2) +
    (dhEmi.getMonth() + 1).toString().padStart(2, '0')
  const CNPJ = infNFe.emit.CNPJ
  const mod = infNFe.ide.mod
  const serie = (infNFe.ide.serie as string).padStart(3, '0')
  const nNF = (infNFe.ide.nNF as string).padStart(9, '0')
  const tpEmis = infNFe.ide.tpEmis
  const cNF = infNFe.ide.cNF
  const chave = `${cUF}${AAMM}${CNPJ}${mod}${serie}${nNF}${tpEmis}${cNF}`
  const cDV = calcularDV(chave).toString()
  infNFe.ide.cDV = cDV
  let Id = `NFe${chave}${cDV}`
  const prefixedInfNFe = { infNFe: { Id, versao: '4.00' } }
  Object.entries(refInfNFe).forEach(([key, value]) => {
    if (!infNFe[key] || key == 'default' || key == 'simpleType') return
    prepararParaXML(infNFe, value, prefixedInfNFe.infNFe)
  })
  infNFe.Id = Id
  return prefixedInfNFe.infNFe
}

export function generateXML(infNFe: INFeRoot) {
  const preparatedJSON = preparateJSON(infNFe)
  console.log(preparatedJSON)
  return toXml({
    NFe: {
      xmlns: 'http://www.portalfiscal.inf.br/nfe',
      infNFe: preparatedJSON,
    },
  })
}

function prepararParaXML(obj: any, ref: any, result: any) {
  const name = ref.name
  const cRoot = name ? obj[name] : obj
  if (!cRoot) return
  if (ref.maxOccurs > 1) {
    if (!cRoot.length) return
    const temp = []
    const itemRef = { ...ref, maxOccurs: 1 }
    for (const el of cRoot as any[]) {
      const validEl: any = {}
      validEl[name] = el
      const item = {}
      prepararParaXML(validEl, itemRef, item)
      temp.push(item[name])
    }
    result[name] = temp
  } else if (ref.choice) {
    const iResult = name ? {} : result
    for (const el of ref.element as any[]) {
      if (el.name) {
        if (cRoot[el.name]) {
          prepararParaXML(cRoot, el, iResult)
          break
        }
      } else {
        const selected = el.element.every((v: any) => {
          const value = cRoot[v.name]
          let retorno = !!v.optional
          if (value) {
            const e = v.restriction?.enumeration
            retorno = !e || (typeof e == 'string' ? e == value : e.includes(value))
          }
          return retorno
        })
        if (selected) {
          prepararParaXML(cRoot, el, iResult)
          break
        }
      }
    }
    if (name && Object.entries(iResult).length) result[name] = iResult
  } else if (ref.element) {
    const iResult = name ? {} : result
    for (const el of ref.element as any[]) {
      if (el.name && cRoot[el.name]) prepararParaXML(cRoot, el, iResult)
      else if (!el.name) prepararParaXML(cRoot, el, iResult)
    }
    if (name && Object.entries(iResult).length) result[name] = iResult
  } else {
    result[name] = ['nItem', 'dia'].includes(name) ? cRoot : { $t: cRoot }
  }
}

function calcularDV(chave: string) {
  let soma = 0 // Vai guardar a Soma
  let peso = 2 // vai guardar o peso de multiplicacao
  //percorrendo cada caracter da chave da direita para esquerda para fazer os calculos com o peso
  for (let i = chave.length - 1; i >= 0; i--, peso++) {
    if (peso == 10) peso = 2
    let atual = Number(chave[i])
    soma += atual * peso
  }
  //Agora que tenho a soma vamos pegar o resto da divisão por 11
  let resto = soma % 11
  //Aqui temos uma regrinha, se o resto da divisão for 0 ou 1 então o dv vai ser 0
  return resto == 0 || resto == 1 ? 0 : 11 - resto
}
