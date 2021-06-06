import { toJson } from 'xml2json'
import { getRandomNumber } from '../getRandomNumber'
import { enviarRequisicao } from '../requisicoes'
import {retEnvEvento} from './retEnvEvento'
import { ICertificate } from '../assinatura/ICertificate'
import { TAmb } from '../TAmb'

export async function recepcaoEvento(
  UF: string,
  cert: ICertificate,
  ambiente: TAmb,
  xml: string
) {
  const envio = `<envEvento versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">
    <idLote>${getRandomNumber(1, 999999999999999)}</idLote>
    ${xml}
  </envEvento>`
  const respRecepcaoEvento = await enviarRequisicao(
    envio,
    'recepcaoEvento',
    ambiente,
    UF,
    cert
  )
  const retEnvEvento = (
    toJson(respRecepcaoEvento, {
      object: true,
      reversible: true,
    }) as any
  )['soap:Envelope']['soap:Body'].nfeResultMsg.retEnvEvento
  return retEnvEvento as retEnvEvento
}
