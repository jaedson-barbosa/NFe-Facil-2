import { https } from 'firebase-functions'
import { ICertificado, IInfos } from '../commom/tipos'
import { requisitarAutorizacao } from '../transmitir/autorizacao'
import { validarProtNFe } from '../transmitir/validarProtNFe'

/** @returns Número do recibo */
export async function autorizar(
  infos: IInfos,
  cert: ICertificado,
  xml: string
) {
  const retEnviNFe: retEnviNFeSinc = await requisitarAutorizacao(
    infos,
    cert,
    xml,
    true
  )
  const protNFe = retEnviNFe.protNFe
  if (!protNFe) {
    throw new https.HttpsError(
      'internal',
      'Falha durante envio de lote de notas fiscais:\n' +
        `${retEnviNFe.cStat.$t}: ${retEnviNFe.xMotivo.$t}`,
      retEnviNFe.xMotivo.$t
    )
  }
  return validarProtNFe(protNFe) && protNFe
}

export interface retEnviNFeSinc {
  versao: { $t: string }
  tpAmb: { $t: string }
  verAplic: { $t: string }
  cStat: { $t: string }
  xMotivo: { $t: string }
  cUF: { $t: string }
  dhRecbto: { $t: string }
  protNFe: any
}
