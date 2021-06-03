import { toJson } from 'xml2json'
import { getRandomNumber } from '../getRandomNumber'
import { enviarRequisicao } from '../requisicoes'
import {retEnvEvento} from './retEnvEvento'
import { ICertificate } from '../assinatura/ICertificate'
import { IEmpresa } from '../IEmpresa'
import { TAmb } from '../TAmb'

export async function recepcaoEvento(
  empresa: IEmpresa,
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
    empresa,
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
