import { firestore } from 'firebase-admin'
import { IDefaultParams, onDefaultRequest } from './onDefaultRequest'
import { Response, HttpsFunction } from 'firebase-functions'

export interface ILoggedParams extends IDefaultParams {
  empRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  UF: string
}

const db = firestore()

export function onLoggedRequest(
  handler: (params: ILoggedParams, resp: Response<any>) => Promise<void>,
  needWritePermission: boolean
): HttpsFunction {
  return onDefaultRequest(async (p, r) => {
    const cnpj = p.body.idEmpresa
    if (!cnpj) {
      r.status(400).send('Requisição sem identificação de emitente.')
      return
    }
    const empresaRef = db.collection('empresas').doc(cnpj)
    const user = await empresaRef.collection('usuarios').doc(p.user.uid).get()
    if (!user.exists) {
      r.status(400).send('Usuário não está cadastrado na empresa.')
      return
    }
    const userStatus = user.get('status')
    if (userStatus >= 3) {
      // Liberada qualquer operação
    } else if (userStatus == 2 && needWritePermission) {
      r.status(400).send(
        'Usuário não tem permissões suficientes para executar esta operação.'
      )
      return
    } else {
      r.status(400).send(
        'Usuário não tem permissão para acessar informações desta empresa.'
      )
      return
    }
    const empresa = await empresaRef.get()
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
