import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'
import { NiveisAcesso } from './tipos'

export default function (
  token: admin.auth.DecodedIdToken,
  CNPJ: string,
  necessarioAdmin = false
) {
  if (!CNPJ) {
    throw new https.HttpsError(
      'failed-precondition',
      'Impossível detectar a empresa.'
    )
  }
  const niveisEscrita = necessarioAdmin
    ? [NiveisAcesso.A]
    : [NiveisAcesso.RW, NiveisAcesso.A]
  const escritaLiberada = niveisEscrita.includes(token[CNPJ])
  if (!escritaLiberada) {
    throw new https.HttpsError(
      'permission-denied',
      'Usuário não tem permissões suficientes para executar esta operação.'
    )
  }
}
