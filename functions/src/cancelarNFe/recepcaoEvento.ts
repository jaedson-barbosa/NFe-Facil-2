import { toJson } from 'xml2json'
import { https } from 'firebase-functions'
import { enviarRequisicao } from '../requisicoes'
import gerarNumero from '../commom/gerarNumero'
import { Ambientes, ICertificado } from '../commom/tipos'

export async function recepcaoEvento(
  UF: string,
  cert: ICertificado,
  ambiente: Ambientes,
  xml: string
) {
  const envio = `<envEvento versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe">
    <idLote>${gerarNumero(1, 999999999999999)}</idLote>
    ${xml}
  </envEvento>`
  const respRecepcaoEvento = await enviarRequisicao(
    envio,
    'recepcaoEvento',
    ambiente,
    UF,
    cert
  )
  const retEnvEvento: retEnvEvento = (
    toJson(respRecepcaoEvento, {
      object: true,
      reversible: true,
    }) as any
  )['soap:Envelope']['soap:Body'].nfeResultMsg.retEnvEvento
  if (retEnvEvento.cStat.$t != '128') {
    const motivo = retEnvEvento.xMotivo.$t
    throw new https.HttpsError('internal', motivo)
  }
  const cStat = retEnvEvento.retEvento.infEvento.cStat.$t
  if (cStat != '135' && cStat != '155') {
    const motivo = retEnvEvento.retEvento.infEvento.xMotivo.$t
    throw new https.HttpsError('invalid-argument', motivo)
  }
  return retEnvEvento
}

export interface retEnvEvento {
  versao: string
  idLote: { $t: string }
  tpAmb: { $t: string }
  verAplic: { $t: string }
  cOrgao: { $t: string }
  cStat: { $t: string }
  xMotivo: { $t: string }
  retEvento: {
    infEvento: {
      cStat: { $t: string }
      xMotivo: { $t: string }
    }
  }
}
