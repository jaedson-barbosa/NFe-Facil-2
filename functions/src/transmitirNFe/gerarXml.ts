import { toXml } from 'xml2json'
import { assinarNFe } from '../assinatura/assinarNFe'

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

export default async function (
  infNFe: any,
  certificado: ICertificado,
  numero: number
) {
  const numeroStr = numero.toString()
  infNFe.ide.nNF.$t = numeroStr
  const oldChave = infNFe.Id.substr(3, 43)
  const novaChave =
    oldChave.substr(0, 25) + numeroStr.padStart(9, '0') + oldChave.substr(34)
  const cDV = calcularDV(novaChave).toString()
  infNFe.ide.cDV.$t = cDV
  infNFe.Id = `NFe${novaChave}${cDV}`
  const NFe = { xmlns: 'http://www.portalfiscal.inf.br/nfe', infNFe }
  const xml = toXml({ NFe })
  const xmlAssinado = await assinarNFe(certificado, xml)
  return xmlAssinado
}
