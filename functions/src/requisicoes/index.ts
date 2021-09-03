import * as https from 'https'
import * as axios from 'axios'
import servicos from './servicos'
import webservicesNFe from './webservicesNFe'

type nomesServicos = keyof typeof servicos &
  keyof typeof webservicesNFe.SVRS.servicos

export async function enviarRequisicao(
  body: string,
  servico: nomesServicos,
  amb: TAmb,
  UF: string,
  cert: ICertificate
): Promise<string> {
  return (
    await axios.default.post(
      getWebServiceByUF(UF).servicos[servico][
        amb == TAmb.Producao ? 'url_producao' : 'url_homologacao'
      ],
      `<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope">
        <Body>
          <nfeDadosMsg xmlns="${servicos[servico].method}">
            ${body}
          </nfeDadosMsg>
        </Body>
        </Envelope>`.replace(/>\s+</g, '><'),
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
          cert: cert.publicCert,
          key: cert.privateCert,
        }),
        headers: { 'Content-Type': 'application/soap+xml' },
      }
    )
  ).data as string
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
