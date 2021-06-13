import { firestore } from 'firebase-admin'
import { ILoggedParams, onLoggedRequest } from './onLoggedRequest'
import { HttpsFunction, https } from 'firebase-functions'
import { ICertificate } from './assinatura/ICertificate'
import { pki } from 'node-forge'

interface ICertifiedParams extends ILoggedParams {
  cert: ICertificate
}

const db = firestore()

export function onCertifiedRequest(
  handler: (params: ICertifiedParams) => Promise<any>,
  needWritePermission: boolean
): HttpsFunction {
  return onLoggedRequest(async ({ body, empRef, UF }) => {
    const senha = body.senha
    if (!senha) {
      throw new https.HttpsError(
        'failed-precondition',
        'Campo "senha" (senha do certificado) ausente.'
      )
    }
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
    const stored = dataCertComplete.data() as ICertificate
    const encrypted = stored.privateCert
    const decrypted = pki.decryptRsaPrivateKey(encrypted, empRef.id + senha)
    if (!decrypted) {
      throw new https.HttpsError(
        'invalid-argument',
        'A senha do certificado informada está errada.'
      )
    }
    stored.privateCert = pki.privateKeyToPem(decrypted)
    return await handler({ body, empRef, UF, cert: stored })
  }, needWritePermission)
}
