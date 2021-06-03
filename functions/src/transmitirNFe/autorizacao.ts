import { toJson } from "xml2json"
import { ICertificate } from "../assinatura/ICertificate"
import { IEmpresa } from "../IEmpresa"
import { getRandomNumber } from "../getRandomNumber"
import { enviarRequisicao } from "../requisicoes"
import { TRetEnviNFe } from "./TRetEnviNFe"
import { TAmb } from "../TAmb"

export async function autorizacao(
  empresa: IEmpresa,
  cert: ICertificate,
  ambiente: TAmb,
  ...xmls: string[]
): Promise<TRetEnviNFe> {
  const respAutorizacao = await enviarRequisicao(
    `<enviNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
      <idLote>${getRandomNumber(1, 999999999999999)}</idLote>
      <indSinc>0</indSinc>
      ${xmls.join('')}
    </enviNFe>`,
    'autorizacao',
    ambiente,
    empresa,
    cert
  )
  const retEnviNFe = (
    toJson(respAutorizacao, {
      object: true,
    }) as any
  )['soap:Envelope']['soap:Body'].nfeResultMsg.retEnviNFe
  return retEnviNFe as TRetEnviNFe
}
