import { enviarRequisicao } from '../requisicoes'
import { toJson } from 'xml2json'
import estados from './estados'
import { Ambientes, ICertificado } from '../commom/tipos'

export async function consultarStatusServico(
  uf: string,
  ambiente: Ambientes,
  cert: ICertificado
) {
  const cUF = estados.find((v) => v[0] === uf)?.[1]
  if (!cUF) throw new Error()
  const res = await enviarRequisicao(
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
  const resJson: any = toJson(res, {
    object: true,
    reversible: false,
  })
  const retConsStatServ =
    resJson['soap:Envelope']['soap:Body'].nfeResultMsg.retConsStatServ
  return retConsStatServ as retConsStatServ
}

export interface retConsStatServ {
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
