import { firestore } from 'firebase-admin'
import { https } from 'firebase-functions'
import { ICertificado } from './tipos'

export default async function (CNPJ: string) {
  const db = firestore()
  const refEmpresa = db.collection('empresas').doc(CNPJ)
  const dataCertComplete = await db
    .collection('certificados')
    .doc(CNPJ)
    .get()
  if (!dataCertComplete.exists) {
    throw new https.HttpsError(
      'not-found',
      'O certificado da empresa não foi encontrado.'
    )
  }
  const certificado = dataCertComplete.data() as ICertificado
  return { refEmpresa, certificado }
}
