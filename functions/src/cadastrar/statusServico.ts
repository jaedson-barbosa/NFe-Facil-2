import { enviarRequisicao } from '../requisicoes'
import { toJson } from 'xml2json'

const Estados: [string, number][] = [
  ['RO', 11],
  ['AC', 12],
  ['AM', 13],
  ['RR', 14],
  ['PA', 15],
  ['AP', 16],
  ['TO', 17],
  ['MA', 21],
  ['PI', 22],
  ['CE', 23],
  ['RN', 24],
  ['PB', 25],
  ['PE', 26],
  ['AL', 27],
  ['SE', 28],
  ['BA', 29],
  ['MG', 31],
  ['ES', 32],
  ['RJ', 33],
  ['SP', 35],
  ['PR', 41],
  ['SC', 42],
  ['RS', 43],
  ['MS', 50],
  ['MT', 51],
  ['GO', 52],
  ['DF', 53],
]

export async function consultarStatusServico(
  uf: string,
  ambiente: TAmb,
  cert: ICertificate
) {
  const cUF = Estados.find((v) => v[0] === uf)?.[1]
  if (!cUF) throw new Error()
  const resp = await enviarRequisicao(
    `<consStatServ versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
      <tpAmb>${ambiente}</tpAmb>
      <cUF>${cUF}</cUF>
      <xServ>STATUS</xServ>
    </consStatServ>`,
    'consultarStatusServico',
    ambiente,
    uf,
    cert
  )
  const retConsStatServ = (
    toJson(resp, {
      object: true,
      reversible: false,
    }) as any
  )['soap:Envelope']['soap:Body'].nfeResultMsg.retConsStatServ
  return retConsStatServ as TRetConsStatServ
}
