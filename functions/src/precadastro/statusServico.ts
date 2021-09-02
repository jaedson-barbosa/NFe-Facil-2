import { enviarRequisicao } from '../requisicoes'
import { IBGE } from '../IBGE.json'
import { toJson } from 'xml2json'

export async function consultarStatusServico(
  uf: string,
  ambiente: TAmb,
  cert: ICertificate
) {
  const cUF = IBGE.find((v) => v.Sigla == uf)?.Codigo
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

export interface TRetConsStatServ {
  versao: string
  tpAmb: string
  verAplic: string
  cStat: string
  xMotivo: string
  cUF: string
  dhRecbto: string
  tMed: string
  dhRetorno: string
  xObs: string
}
