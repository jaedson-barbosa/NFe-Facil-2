import { firestore } from 'firebase-admin'
import { ILoggedParams, onLoggedRequest } from "./onLoggedRequest"
import { Response, HttpsFunction } from 'firebase-functions'
import { ICertificate } from './assinatura/ICertificate'
import { pki } from 'node-forge'

interface ICertifiedParams extends ILoggedParams {
  cert: ICertificate
}

const db = firestore()

export function onCertifiedRequest(
  handler: (
    params: ICertifiedParams,
    resp: Response<any>
  ) => Promise<void>,
  needWritePermission: boolean
): HttpsFunction {
  return onLoggedRequest(async (p, r) => {
    const senha = p.body.senha
    if (!senha) {
      r.status(400).send('Não foi informada a senha.')
      return
    }
    const cnpj = p.empRef.id
    const dataCertComplete = await db.collection('certificados').doc(cnpj).get()
    if (!dataCertComplete.exists) {
      r.status(400).send('Certificado não encontrado.')
      return
    }
    const stored = dataCertComplete.data() as ICertificate
    const encrypted = stored.privateCert
    const decrypted = pki.decryptRsaPrivateKey(encrypted, cnpj + senha)
    if (!decrypted) {
      r.status(400).send('Senha errada.')
      return
    }
    stored.privateCert = pki.privateKeyToPem(decrypted)
    await handler({ ...p, cert: stored }, r)
  }, needWritePermission)
}
