import { firestore } from 'firebase-admin'
import { IEmpresa } from "./IEmpresa"
import { IDefaultParams, onDefaultRequest } from "./onDefaultRequest"
import { Response, HttpsFunction } from 'firebase-functions'

interface ILoggedParams extends IDefaultParams {
  empRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  empData: IEmpresa
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
    } else {
      const empresa = await db.collection('empresas').doc(cnpj).get()
      if (!empresa.exists) {
        r.status(400).send('Empresa não existe')
      } else {
        const empRef = empresa.ref
        const empData = empresa.data()! as IEmpresa
        await handler({ ...p, empRef, empData }, r)
      }
    }
  })
}
