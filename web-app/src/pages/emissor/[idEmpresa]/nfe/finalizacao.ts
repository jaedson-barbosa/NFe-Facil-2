import { IBGE } from '@form/data/IBGE.json'
import { complexType } from '@form/data/nfe.json'
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
  const prefixedInfNFe = addPrefix(infNFe, complexType[0])
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

//Agora vai também ordenar
function addPrefix(obj: any, referencia: any) {
  function getChoiceIndex(iRoot: any, novaReferencia: any) {
    return novaReferencia.element.findIndex((v) => {
      return v.name
        ? !!iRoot[v.name]
        : v.element.every((k: any) => {
            if (iRoot[k.name]) {
              const curEnum = k.restriction?.enumeration
              return curEnum
                ? typeof curEnum == 'string'
                  ? curEnum == iRoot[k.name]
                  : curEnum.includes(iRoot[k.name])
                : true
            }
            return !!k.optional
          })
    })
  }
  function getPosition(name: string) {
    const i0 = referencia.element.findIndex((v) => {
      if (v.name) return v.name == name
      else {
        return (v.element as any[]).some((k) => {
          if (k.name) return k.name == name
          else
            return (k.element as any[]).some((j) => {
              if (j.name) return j.name == name
              return false
            })
        })
      }
    })
    if (i0 != -1) return i0
    console.log(i0)
    console.log(name)
    console.log(referencia)
    throw new Error('Invalid reference')
  }
  const elements = Object.entries(obj).filter(
    ([v0, v1]) => v1 && v0 != 'undefined' && !!Object.entries(v1).length
  )
  if (
    elements.some(
      ([v0, v1]) => !v1 || v0 == 'undefined' || !Object.entries(v1).length
    )
  ) {
    throw new Error('Invalid filter')
  }
  if (!Array.isArray(obj)) {
    // A ordem dos itens em arrays não importa
    console.log(elements)
    elements.sort((a, b) => (getPosition(a[0]) > getPosition(b[0]) ? 1 : -1))
  }
  return elements.reduce(
    (p, [name, v1]) => {
      if (Array.isArray(v1)) {
        const novaReferencia = referencia.element.find((v) => v.name == name)
        if (!novaReferencia) {
          console.log(referencia, name)
        }
        p[name] = v1.map(v => addPrefix(v, novaReferencia))
        return p
      } else if (typeof v1 == 'object') {
        let novaReferencia = referencia.name == name ? referencia : referencia.element.find((v) => v.name == name)
        function update() {
          for (const v of referencia.element.filter(v => v.choice)) {
            if (v.name == name) {
              novaReferencia = v
              break
            }
            for (const k of v.element) {
              if (k.name == name) {
                novaReferencia = k
                break
              }
              for (const j of k.element) {
                if (j.name == name) {
                  novaReferencia = j
                  break
                }
              }
              if (novaReferencia) break
            }
            if (novaReferencia) break
          }
        }
        if (!novaReferencia) update()
        if (!novaReferencia) console.log(referencia, name)
        if (novaReferencia.choice) {
          const index = getChoiceIndex(v1, novaReferencia)
          if (index < 0) {
            console.log(v1, novaReferencia)
            throw new Error('Invalid index')
          }
          novaReferencia = novaReferencia.element[index]
          console.log(novaReferencia)
        } else console.log(novaReferencia)
        // if (name != novaReferencia) update()
        console.log(name)
        console.log(v1)
        p[name] = addPrefix(v1, novaReferencia)
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
