import { https } from 'firebase-functions'
import { toJson } from 'xml2json'
import { enviarRequisicao } from '../requisicoes'
import gerarNumero from '../commom/gerarNumero'
import { ICertificado, IInfos } from '../commom/tipos'

/** @returns Número do recibo */
export default async function (
  { UF, ambiente }: IInfos,
  cert: ICertificado,
  ...xmls: string[]
): Promise<string> {
  const respAutorizacao = await enviarRequisicao(
    `<enviNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
      <idLote>${gerarNumero(1, 999999999999999)}</idLote>
      <indSinc>0</indSinc>
      ${xmls.join('')}
    </enviNFe>`,
    'autorizacao',
    ambiente,
    UF,
    cert
  )
  const retEnviNFe: retEnviNFe = (
    toJson(respAutorizacao, {
      object: true,
    }) as any
  )['soap:Envelope']['soap:Body'].nfeResultMsg.retEnviNFe
  validarResposta(retEnviNFe)
  await esperarProcessamento(retEnviNFe)
  const numeroRecibo = retEnviNFe.infRec.nRec
  return numeroRecibo
}

function validarResposta(res: retEnviNFe) {
  if (res.cStat != '103') {
    throw new https.HttpsError(
      'internal',
      'Falha durante envio de lote de notas fiscais.',
      res.xMotivo
    )
  }
}

async function esperarProcessamento(res: retEnviNFe) {
  const tempoMedioResposta = res.infRec.tMed
  const intervalo = Number(tempoMedioResposta) * 1000
  await new Promise((res) => setTimeout(res, intervalo))
}

export interface retEnviNFe {
  versao: string
  tpAmb: string
  verAplic: string
  cStat: string
  xMotivo: string
  cUF: string
  dhRecbto: string
  infRec: {
    nRec: string
    tMed: string
  }
}
