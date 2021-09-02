import { firestore } from 'firebase-admin'
import { ILoggedParams, onLoggedRequest } from './onLoggedRequest'
import { HttpsFunction, https } from 'firebase-functions'

interface ICertifiedParams extends ILoggedParams {
  cert: ICertificate
}

const db = firestore()

export function onCertifiedRequest(
  handler: (params: ICertifiedParams) => Promise<any>,
  needWritePermission: boolean
): HttpsFunction {
  return onLoggedRequest(async ({ body, empRef, UF }) => {
    const dataCertComplete = await db
      .collection('certificados')
      .doc(empRef.id)
      .get()
    if (!dataCertComplete.exists) {
      throw new https.HttpsError(
        'not-found',
        'O certificado da empresa não foi encontrado.'
      )
    }
    const cert = dataCertComplete.data() as ICertificate
    return await handler({ body, empRef, UF, cert })
  }, needWritePermission)
}
