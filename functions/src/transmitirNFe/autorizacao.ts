import { https } from 'firebase-functions'
import { toJson } from 'xml2json'
import { getRandomNumber } from '../getRandomNumber'
import { enviarRequisicao } from '../requisicoes'

/** @returns Número do recibo */
export default async function (
  { UF, ambiente }: IInfos,
  cert: ICertificado,
  ...xmls: string[]
): Promise<string> {
  const respAutorizacao = await enviarRequisicao(
    `<enviNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
      <idLote>${getRandomNumber(1, 999999999999999)}</idLote>
      <indSinc>0</indSinc>
      ${xmls.join('')}
    </enviNFe>`,
    'autorizacao',
    ambiente,
    UF,
    cert
  )
  const retEnviNFe: TRetEnviNFe = (
    toJson(respAutorizacao, {
      object: true,
    }) as any
  )['soap:Envelope']['soap:Body'].nfeResultMsg.retEnviNFe
  validarResposta(retEnviNFe)
  await esperarProcessamento(retEnviNFe)
  const numeroRecibo = retEnviNFe.infRec.nRec
  return numeroRecibo
}

function validarResposta(res: TRetEnviNFe) {
  if (res.cStat != '103') {
    throw new https.HttpsError(
      'internal',
      'Falha durante envio de lote de notas fiscais.',
      res.xMotivo
    )
  }
}

async function esperarProcessamento(res: TRetEnviNFe) {
  const tempoMedioResposta = res.infRec.tMed
  const intervalo = Number(tempoMedioResposta) * 1000
  await new Promise((res) => setTimeout(res, intervalo))
}
