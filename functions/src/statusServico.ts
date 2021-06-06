import { onCertifiedRequest } from './onCertifiedRequest'
import { enviarRequisicao } from './requisicoes'
import { TAmb } from './TAmb'
import { IBGE } from './IBGE.json'
import { ICertificate } from './assinatura/ICertificate'
import { toJson } from 'xml2json'

export const statusServico = onCertifiedRequest(
  async ({ UF, cert }, res) => {
    const ambiente = TAmb.Homologacao
    const resp = await consultarStatusServico(UF, ambiente, cert)
    res.status(200).send(resp.xMotivo)
  }
)

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
