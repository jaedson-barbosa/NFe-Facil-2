import * as https from 'https'
import * as axios from 'axios'
import servicos from './servicos'
import webservicesNFe from './webservicesNFe'
import { Ambientes, ICertificado } from '../commom/tipos'
import webservicesNFCe from './webservicesNFCe'

type nomesServicos = keyof typeof servicos & keyof typeof webservicesNFe.SVRS

export async function enviarRequisicao(
  corpo: string,
  servico: nomesServicos,
  ambiente: Ambientes,
  UF: string,
  cert: ICertificado,
  ehNFCe: boolean
): Promise<string> {
  const webservices = ehNFCe ? webservicesNFCe : webservicesNFe
  const endereco = webservices[UF][servico][ambiente]
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
