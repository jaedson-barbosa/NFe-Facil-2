import { IBGE } from '@form/data/IBGE.json'
import toXml from '@xml2json/json2xml'

export default function generateXml(infNFe: any) {
  // Calculo da chave
  const cUF = IBGE.find(
    (v) => v.Sigla == (infNFe.emit.enderEmit.UF as string)
  )!.Codigo
  const k = new Date(infNFe.ide.dhEmi)
  const AAMM =
    k.getFullYear().toString().slice(2) +
    k.getMonth().toString().padStart(2, '0')
  const CNPJ = infNFe.emit.CNPJ
  const mod = infNFe.ide.mod
  const serie = (infNFe.ide.serie as string).padStart(3, '0')
  const nNF = (infNFe.ide.nNF as string).padStart(9, '0')
  const tpEmis = infNFe.ide.tpEmis
  const cNF = infNFe.ide.cNF
  const chave = `${cUF}${AAMM}${CNPJ}${mod}${serie}${nNF}${tpEmis}${cNF}`
  const cDV = calcularDV(chave).toString()
  infNFe.ide.cDV = cDV
  delete infNFe['Id']
  const prefixedInfNFe = addPrefix(infNFe)
  prefixedInfNFe.versao = '4.00'
  prefixedInfNFe.Id = infNFe.Id = `NFe${chave}${cDV}`
  const xml = toXml({
    NFe: {
      xmlns: 'http://www.portalfiscal.inf.br/nfe',
      infNFe: prefixedInfNFe,
    },
  })
  return xml
}

function addPrefix(obj: any) {
  return Object.entries(obj).reduce(
    (p, [v0, v1]) => {
      const name = v0
      if (!v1) return p
      if (typeof v1 == 'object') {
        if (Object.entries(v1).length) {
          p[name] = addPrefix(v1)
        }
        return p
      }
      p[name] = name == 'nItem' || name == 'dia' ? v1 : { $t: v1 }
      return p
    },
    Array.isArray(obj) ? [] : ({} as any)
  )
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
