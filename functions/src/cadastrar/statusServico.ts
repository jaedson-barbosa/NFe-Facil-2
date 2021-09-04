import { enviarRequisicao } from '../requisicoes'
import { toJson } from 'xml2json'
import estados from './estados'

export async function consultarStatusServico(
  uf: string,
  ambiente: TAmb,
  cert: ICertificado
) {
  const cUF = estados.find((v) => v[0] === uf)?.[1]
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
