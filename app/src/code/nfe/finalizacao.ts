import IBGE from '../IBGE'
import type { INFeRoot } from '../tipos'
import refInfNFe, { IElement } from './estrutura'
import toXml from './json2xml'

export function preparateJSON(infNFe: INFeRoot, addt = false) {
  const { cDV, Id } = calcularId(infNFe)
  infNFe.ide.cDV = cDV
  infNFe.Id = Id
  const reorganizado = reorganizarJSON(infNFe, refInfNFe, addt)
  console.log(reorganizado)
  return { Id, versao: '4.00', ...reorganizado }
}

export function generateXML(infNFe: INFeRoot) {
  const preparatedJSON = preparateJSON(infNFe, true)
  return toXml({
    NFe: {
      xmlns: 'http://www.portalfiscal.inf.br/nfe',
      infNFe: preparatedJSON,
    },
  })
}

function calcularId(infNFe: INFeRoot) {
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
  const Id = `NFe${chave}${cDV}`
  return { cDV, Id }
}

function reorganizarJSON(
  json: any,
  ref: IElement | IElement[],
  prefixar: boolean
) {
  function presente(campo: any) {
    return typeof campo === 'object'
      ? Object.keys(campo).length > 0
      : !!campo || campo === 0
  }

  function ajustarValor(ref: IElement, campo: any) {
    function format(n: number, decimal: number) {
      const minimo = n.toFixed(2)
      if (decimal <= 2) return minimo
      const maximo = n.toFixed(decimal) // or any
      const corrigido = maximo.replace(/\.?0+$/, '')
      return corrigido.length < minimo.length ? minimo : corrigido
    }

    return prefixar && !['nItem', 'dia'].includes(ref.name)
      ? { $t: ref.decimal ? format(+campo, ref.decimal) : campo }
      : campo
  }

  if (Array.isArray(ref)) {
    const result = {}
    for (const item of ref) {
      const res = reorganizarJSON(json, item, prefixar)
      if (presente(res)) result[item.name] = res
    }
    return Object.keys(result).length ? result : undefined
  } else {
    const campo: any = json[ref.name]
    if (!presente(campo)) {
      return undefined
    } else if (ref.maxOccurs) {
      const lista = Array.isArray(campo) ? (campo as any[]) : [campo]
      return ref.element
        ? lista.map((v) => reorganizarJSON(v, ref.element, prefixar))
        : lista.map((v) => ajustarValor(ref, v))
    } else if (ref.element) {
      const result = {}
      for (const item of ref.element) {
        const res = reorganizarJSON(campo, item, prefixar)
        if (presente(res)) result[item.name] = res
      }
      return result
    } else {
      return ajustarValor(ref, campo)
    }
  }
}
