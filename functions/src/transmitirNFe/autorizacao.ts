import { https } from 'firebase-functions'
import { ICertificado, IInfos } from '../commom/tipos'
import { requisitarAutorizacao, retEnviNFeBase } from '../transmitir/autorizacao'

/** @returns Número do recibo */
export default async function (
  infos: IInfos,
  cert: ICertificado,
  xml: string
): Promise<string> {
  const res = await requisitarAutorizacao(infos, cert, xml, false)
  validarResposta(res)
  const retEnviNFe = res as retEnviNFeAssinc
  await esperarProcessamento(retEnviNFe)
  const numeroRecibo = retEnviNFe.infRec.nRec
  return numeroRecibo
}

function validarResposta(res: retEnviNFeBase) {
  if (res.cStat != '103') {
    throw new https.HttpsError(
      'internal',
      'Falha durante envio de lote de notas fiscais.',
      res.xMotivo
    )
  }
}

async function esperarProcessamento(res: retEnviNFeAssinc) {
  const tempoMedioResposta = res.infRec.tMed
  const intervalo = Number(tempoMedioResposta) * 1000
  await new Promise((res) => setTimeout(res, intervalo))
}

export interface retEnviNFeAssinc extends retEnviNFeBase {
  infRec: {
    nRec: string
    tMed: string
  }
}

export interface retEnviNFeSinc extends retEnviNFeBase {
  protNFe: any
}
