import { toJson } from "xml2json"
import { ICertificate } from "../assinatura/ICertificate"
import { enviarRequisicao } from "../requisicoes"
import { TAmb } from "../TAmb"
import { TRetConsReciNFe } from "./TRetConsReciNFe"

export async function retAutorizacao(
  UF: string,
  cert: ICertificate,
  ambiente: TAmb,
  nRec: string
): Promise<TRetConsReciNFe> {
  const respRetAutorizacao = await enviarRequisicao(
    `<consReciNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
      <tpAmb>${ambiente}</tpAmb>
      <nRec>${nRec}</nRec>
    </consReciNFe>`,
    'retAutorizacao',
    ambiente,
    UF,
    cert
  )
  const retConsReciNFe = (
    toJson(respRetAutorizacao, {
      object: true,
      reversible: true,
    }) as any
  )['soap:Envelope']['soap:Body'].nfeResultMsg.retConsReciNFe
  return retConsReciNFe as TRetConsReciNFe
}
