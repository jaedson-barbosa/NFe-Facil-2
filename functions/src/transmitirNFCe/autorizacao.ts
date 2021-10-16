import { ICertificado, IInfos } from '../commom/tipos'
import {
  requisitarAutorizacao,
  retEnviNFeBase,
} from '../transmitir/autorizacao'
import { validarProtNFe } from '../transmitir/validarProtNFe'

/** @returns Número do recibo */
export async function autorizar(
  infos: IInfos,
  cert: ICertificado,
  xml: string
) {
  const res = await requisitarAutorizacao(infos, cert, xml, true)
  const retEnviNFe = res as retEnviNFeSinc
  const protNFe = retEnviNFe.protNFe
  return validarProtNFe(protNFe) && protNFe
}

export interface retEnviNFeSinc extends retEnviNFeBase {
  protNFe: any
}
