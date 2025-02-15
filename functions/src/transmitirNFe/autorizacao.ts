import { https } from 'firebase-functions'
import { Ambientes, ICertificado, IInfos } from '../commom/tipos'
import {
  requisitarAutorizacao,
  retEnviNFeBase,
} from '../transmitir/autorizacao'
import { toJson } from 'xml2json'
import { enviarRequisicao } from '../requisicoes'
import { validarProtNFe } from '../transmitir/validarProtNFe'

/** @returns Protocolo da NF-e */
export async function autorizar(
  infos: IInfos,
  cert: ICertificado,
  xml: string
): Promise<retConsReciNFe | undefined> {
  const resAutorizacao = await requisitarAutorizacao(infos, cert, xml, false)
  validarRespostaPedido(resAutorizacao)
  const retEnviNFe = resAutorizacao as retEnviNFeAssinc
  const { nRec, tMed } = retEnviNFe.infRec
  await new Promise((res) => setTimeout(res, +tMed * 1000))
  const protNFe = await consultarResultado(infos, cert, nRec)
  return protNFe
}

function validarRespostaPedido(res: retEnviNFeBase) {
  if (res.cStat != '103') {
    throw new https.HttpsError(
      'internal',
      `Falha durante envio de lote de notas fiscais:
      ${res.cStat}: ${res.xMotivo}`,
      res.xMotivo
    )
  }
}

async function consultarResultado(
  infos: IInfos,
  certificado: ICertificado,
  numeroRecibo: string
) {
  let respRet: retConsReciNFe | undefined = undefined
  do {
    respRet = await enviarRequisicaoConsultarResultado(
      infos.UF,
      certificado,
      infos.ambiente,
      numeroRecibo
    )
    if (respRet.cStat.$t == '105') {
      // Lote em processamento (78)
      respRet = undefined
      await new Promise((res) => setTimeout(res, 3000))
    }
  } while (!respRet)
  if (respRet.cStat.$t != '104') {
    throw new https.HttpsError(
      'internal',
      'Falha no lote de notas fiscais.',
      respRet.xMotivo.$t
    )
  }
  const protNFe = respRet.protNFe
  return validarProtNFe(protNFe) && protNFe
}

async function enviarRequisicaoConsultarResultado(
  UF: string,
  cert: ICertificado,
  ambiente: Ambientes,
  nRec: string
): Promise<retConsReciNFe> {
  const respRetAutorizacao = await enviarRequisicao(
    `<consReciNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
      <tpAmb>${ambiente}</tpAmb>
      <nRec>${nRec}</nRec>
    </consReciNFe>`,
    'retAutorizacao',
    ambiente,
    UF,
    cert,
    false
  )
  const retConsReciNFe = (
    toJson(respRetAutorizacao, {
      object: true,
      reversible: true,
    }) as any
  )['soap:Envelope']['soap:Body'].nfeResultMsg.retConsReciNFe
  return retConsReciNFe as retConsReciNFe
}

export interface retConsReciNFe {
  versao: string
  tpAmb: { $t: string }
  verAplic: { $t: string }
  nRec: { $t: string }
  cStat: { $t: string }
  xMotivo: { $t: string }
  cUF: { $t: string }
  dhRecbto: { $t: string }
  cMsg: { $t: string }
  xMsg: { $t: string }
  protNFe: any
}

interface retEnviNFeAssinc extends retEnviNFeBase {
  infRec: {
    nRec: string
    tMed: string
  }
}
