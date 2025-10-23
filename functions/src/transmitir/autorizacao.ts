import { toJson } from 'xml2json'
import { enviarRequisicao } from '../requisicoes'
import gerarNumero from '../commom/gerarNumero'
import { ICertificado, IInfos } from '../commom/tipos'

export async function requisitarAutorizacao(
  { UF, ambiente }: IInfos,
  cert: ICertificado,
  xml: string,
  ehNFCe: boolean
) {
  const envio = '<enviNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
  `<idLote>${gerarNumero(1, 999999999999999)}</idLote>` +
  `<indSinc>1</indSinc>${xml}</enviNFe>`
  const respAutorizacao = await enviarRequisicao(
    envio,
    'autorizacao',
    ambiente,
    UF,
    cert,
    ehNFCe
  )
  const retEnviNFe = (
    toJson(respAutorizacao, {
      object: true,
      reversible: ehNFCe,
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
