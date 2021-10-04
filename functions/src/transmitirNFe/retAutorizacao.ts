import { https } from 'firebase-functions'
import { toJson } from 'xml2json'
import { Ambientes, ICertificado, IInfos } from '../commom/tipos'
import { enviarRequisicao } from '../requisicoes'

/** @returns Retorna undefined caso o número já esteja registrado */
export default async function (
  infos: IInfos,
  certificado: ICertificado,
  numeroRecibo: string
) {
  let respRet: retConsReciNFe | undefined = undefined
  do {
    respRet = await consultarResposta(
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
  const cStat = respRet.protNFe.infProt.cStat.$t
  // Rejeição: Duplicidade de NF-e com diferença na Chave de Acesso (148)
  // Rejeição: NF-e já está inutilizada na Base de Dados da SEFAZ
  if (cStat == '539' || cStat == '206') return undefined
  if (cStat != '100') {
    const motivoRecusa = respRet.protNFe.infProt.xMotivo.$t
    throw new https.HttpsError('invalid-argument', motivoRecusa)
  }
  return respRet
}

async function consultarResposta(
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
    cert
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
