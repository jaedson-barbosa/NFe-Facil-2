import { https } from 'firebase-functions'

export function validarProtNFe(protNFe: any) {
  const cStat = protNFe.infProt.cStat.$t
  // Rejeição: Duplicidade de NF-e com diferença na Chave de Acesso (148)
  // Rejeição: NF-e já está inutilizada na Base de Dados da SEFAZ
  if (cStat == '539' || cStat == '206') return false
  if (cStat != '100') {
    const motivoRecusa = protNFe.infProt.xMotivo.$t
    throw new https.HttpsError('invalid-argument', motivoRecusa)
  }
  return true
}