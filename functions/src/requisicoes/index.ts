import { onLoggedRequest, IEmpresaGet } from '../core'
import * as https from 'https'
import * as axios from 'axios'
import * as servicos from './servicos.json'
import * as webservicesNFe from './webservicesNFe.json'
import { IBGESimplificado } from '../IBGESimplificado.json'
import { ambientes } from './core'
export { ambientes }

type nomesServicos = keyof typeof servicos &
  keyof typeof webservicesNFe.SVRS.servicos

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
// if (usuario.exists) res.status(200).send(usuario.data())
// else res.status(400).send('Usuário não cadastrado')
// TO-DO: Implementar análise de permissões

export const consultarStatusServico = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    const ambiente = ambientes.Homologacao
    const uf = empresa.emit.enderEmit.UF as string
    const cUF = IBGESimplificado.find((v) => v.Sigla == uf)?.Codigo
    res.status(200).send(
      await enviarRequisicao(
        `<consStatServ versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
                <tpAmb>${ambiente}</tpAmb>
                <cUF>${cUF}</cUF>
                <xServ>STATUS</xServ>
            </consStatServ>`,
        'consultarStatusServico',
        ambiente,
        empresa
      )
    )
  }
)

export function autorizacao(
  empresa: IEmpresaGet,
  ambiente: ambientes,
  ...xmls: string[]
): Promise<string> {
  return enviarRequisicao(
    `<enviNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
            <idLote>${getRandomNumber(1, 999999999999999)}</idLote>
            <indSinc>0</indSinc>
            ${xmls.join('')}
        </enviNFe>`,
    'autorizacao',
    ambiente,
    empresa
  )
}

async function enviarRequisicao(
  body: string,
  servico: nomesServicos,
  amb: ambientes,
  empresa: IEmpresaGet
): Promise<string> {
  return (
    await axios.default.post(
      getWebServiceByUF(empresa.emit.enderEmit.UF as string).servicos[servico][
        amb == ambientes.Producao ? 'url_producao' : 'url_homologacao'
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
          cert: empresa.publicCert,
          key: empresa.privateCert,
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
    case 'PA':
      return webservicesNFe.SVAN
    case 'AC':
    case 'AL':
    case 'AP':
    case 'DF':
    case 'ES':
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
