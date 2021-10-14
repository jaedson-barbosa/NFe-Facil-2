import { toJson } from 'xml2json'
import { enviarRequisicao } from '../requisicoes'
import gerarNumero from '../commom/gerarNumero'
import { ICertificado, IInfos } from '../commom/tipos'

export async function requisitarAutorizacao(
  { UF, ambiente }: IInfos,
  cert: ICertificado,
  xml: string,
  sinc: boolean
) {
  const respAutorizacao = await enviarRequisicao(
    `<enviNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
      <idLote>${gerarNumero(1, 999999999999999)}</idLote>
      <indSinc>${sinc ? 1 : 0}</indSinc>
      ${xml}
    </enviNFe>`,
    'autorizacao',
    ambiente,
    UF,
    cert
  )
  const retEnviNFe: retEnviNFeBase = (
    toJson(respAutorizacao, {
      object: true,
    }) as any
  )['soap:Envelope']['soap:Body'].nfeResultMsg.retEnviNFe
  return retEnviNFe
}

export interface retEnviNFeBase {
  versao: string
  tpAmb: string
  verAplic: string
  cStat: string
  xMotivo: string
  cUF: string
  dhRecbto: string
}