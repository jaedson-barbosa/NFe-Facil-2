import { firestore } from 'firebase-admin'
import { IDefaultParams, onDefaultRequest } from "./onDefaultRequest"
import { Response, HttpsFunction } from 'firebase-functions'

export interface ILoggedParams extends IDefaultParams {
  empRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  UF: string
}

const db = firestore()

export function onLoggedRequest(
  handler: (
    params: ILoggedParams,
    resp: Response<any>
  ) => Promise<void>
): HttpsFunction {
  return onDefaultRequest(async (p, r) => {
    const cnpj = p.body.idEmpresa
    if (!cnpj) {
      r.status(400).send('Requisição sem identificação de emitente.')
      return
    }
    const empresa = await db.collection('empresas').doc(cnpj).get()
    if (!empresa.exists) {
      r.status(400).send('Empresa não existe')
      return
    }
    const empRef = empresa.ref
    const UF = empresa.get('emit.enderEmit.UF')
    if (!UF) {
      r.status(400).send('UF do emitente não consta no cadastro.')
      return
    }
    await handler({ ...p, empRef, UF }, r)
  })
}
