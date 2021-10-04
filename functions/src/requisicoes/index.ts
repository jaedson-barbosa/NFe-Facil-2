import * as https from 'https'
import * as axios from 'axios'
import servicos from './servicos'
import webservicesNFe from './webservicesNFe'
import { Ambientes, ICertificado } from '../commom/tipos'

type nomesServicos = keyof typeof servicos & keyof typeof webservicesNFe.SVRS

export async function enviarRequisicao(
  corpo: string,
  servico: nomesServicos,
  ambiente: Ambientes,
  UF: string,
  cert: ICertificado
): Promise<string> {
  const endereco = getWebServiceByUF(UF)[servico][ambiente]
  const metodo = servicos[servico].metodo
  corpo = corpo.replace(/>\s+</g, '><')
  const xml =
    '<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope"><Body>' +
    `<nfeDadosMsg xmlns="${metodo}">${corpo}</nfeDadosMsg>` +
    '</Body></Envelope>'
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    cert: cert.chavePublica,
    key: cert.chavePrivada,
  })
  const headers = { 'Content-Type': 'application/soap+xml' }
  const parametros = { httpsAgent, headers }
  const res = await axios.default.post(endereco, xml, parametros)
  return res.data as string
}

function getWebServiceByUF(uf: string) {
  switch (uf) {
    case 'AM':
      return webservicesNFe.AM
    case 'BA':
      return webservicesNFe.BA
    case 'CE':
      return webservicesNFe.CE
    case 'GO':
      return webservicesNFe.GO
    case 'MG':
      return webservicesNFe.MG
    case 'MS':
      return webservicesNFe.MS
    case 'MT':
      return webservicesNFe.MT
    case 'PE':
      return webservicesNFe.PE
    case 'PR':
      return webservicesNFe.PR
    case 'RS':
      return webservicesNFe.RS
    case 'SP':
      return webservicesNFe.SP
    case 'MA':
      return webservicesNFe.SVAN
    case 'AC':
    case 'AL':
    case 'AP':
    case 'DF':
    case 'ES':
    case 'PA':
    case 'PB':
    case 'PI':
    case 'RJ':
    case 'RN':
    case 'RO':
    case 'RR':
    case 'SC':
    case 'SE':
    case 'TO':
      return webservicesNFe.SVRS
    default:
      throw new Error('Autorizador não encontrado!')
  }
}
