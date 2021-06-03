import { firestore } from 'firebase-admin'
import { ICertificate } from './ICertificate'

const db = firestore()

export async function getCert(cnpj: string): Promise<ICertificate | undefined> {
  const dataCertComplete = await db.collection('certificados').doc(cnpj).get()
  if (!dataCertComplete.exists) {
    return undefined
  }
  return dataCertComplete.data() as ICertificate
}