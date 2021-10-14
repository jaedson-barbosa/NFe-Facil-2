import { ICertificado, IInfos } from '../commom/tipos'
import {
  requisitarAutorizacao,
  retEnviNFeBase,
} from '../transmitir/autorizacao'
import { validarRetAutorizacao } from '../transmitir/validarRetAutorizacao'

/** @returns Número do recibo */
export async function autorizar(
  infos: IInfos,
  cert: ICertificado,
  xml: string
) {
  const res = await requisitarAutorizacao(infos, cert, xml, true)
  const retEnviNFe = res as retEnviNFeSinc
  return validarRetAutorizacao(retEnviNFe.protNFe) ? retEnviNFe : undefined
}

export interface retEnviNFeSinc extends retEnviNFeBase {
  protNFe: any
}
