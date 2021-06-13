import { firestore } from 'firebase-admin'
import { onDefaultRequest } from './onDefaultRequest'
import { HttpsFunction, https } from 'firebase-functions'

export interface ILoggedParams {
  body: any
  empRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  UF: string
}

const db = firestore()

export function onLoggedRequest(
  handler: (params: ILoggedParams) => Promise<any>,
  needWritePermission: boolean
): HttpsFunction {
  return onDefaultRequest(async ({ uid, body }) => {
    if (!body.idEmpresa) {
      throw new https.HttpsError(
        'failed-precondition',
        'Campo "idEmpresa" (id da empresa referente à operação) ausente.'
      )
    }
    const empresaRef = db.collection('empresas').doc(body.idEmpresa)
    const user = await empresaRef.collection('usuarios').doc(uid).get()
    if (!user.exists) {
      throw new https.HttpsError(
        'not-found',
        'Usuário não está cadastrado na empresa.'
      )
    }
    const userStatus = user.get('status')
    if (userStatus >= 3) {
      // Liberada qualquer operação
    } else if (userStatus == 2) {
      if (needWritePermission) {
        throw new https.HttpsError(
          'permission-denied',
          'Usuário não tem permissões suficientes para executar esta operação.'
        )
      } else {
        // Operação de leitura e usuário tem esta permissão
      }
    } else {
      throw new https.HttpsError(
        'permission-denied',
        'Usuário não tem permissão para acessar informações desta empresa.'
      )
    }
    const empresa = await empresaRef.get()
    if (!empresa.exists) {
      throw new https.HttpsError(
        'not-found',
        'Empresa não está cadastrada no banco de dados.'
      )
    }
    const empRef = empresa.ref
    const UF = empresa.get('emit.enderEmit.UF')
    if (!UF) {
      throw new https.HttpsError(
        'failed-precondition',
        'O emitente ainda não tem todas as informações necessárias cadastradas.'
      )
    }
    return await handler({ body, empRef, UF })
  })
}
