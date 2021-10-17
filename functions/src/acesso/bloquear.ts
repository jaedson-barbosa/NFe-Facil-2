import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'
import { IReqRemMembro, IResRemMembro, NiveisAcesso } from '../commom/tipos'
import validarAutenticacao from '../commom/validarAutenticacao'
import validarPermissao from '../commom/validarPermissao'

const { auth } = admin

export default async function (
  req: IReqRemMembro,
  context: https.CallableContext
): Promise<IResRemMembro> {
  validarAutenticacao(context)
  validarRequisicao(req)
  const token = context.auth!.token
  validarPermissao(token, req.CNPJ, true)
  if (req.idUsuario) {
    // Estamos buscando bloquear um terceiro
    let otherUser: admin.auth.UserRecord
    try {
      otherUser = await auth().getUser(req.idUsuario)
    } catch (error: any) {
      throw new https.HttpsError(
        'failed-precondition',
        'Não foi possível encontrar um usuário com este ID.',
        error.message
      )
    }
    const { customClaims } = otherUser
    if (!customClaims) {
      throw new https.HttpsError(
        'invalid-argument',
        'Usuário sem liberações de acesso.'
      )
    }
    const nivel: NiveisAcesso = customClaims[req.CNPJ]
    if (!nivel) {
      throw new https.HttpsError(
        'invalid-argument',
        'Usuário já não tinha acesso a esta empresa.'
      )
    }
    if (nivel == NiveisAcesso.A) {
      throw new https.HttpsError(
        'permission-denied',
        'Não é possível bloquear outro administrador.'
      )
    }
    delete customClaims[req.CNPJ]
    await auth().setCustomUserClaims(req.idUsuario, customClaims)
  } else {
    // O usuário quer se bloquear, entao deletamos o CNPJ do registro
    delete token[req.CNPJ]
    const customClaims: { [cnpj: string]: NiveisAcesso } = {}
    const niveis = [NiveisAcesso.R, NiveisAcesso.RW, NiveisAcesso.A]
    Object.entries(token)
      .filter(([_, v]) => niveis.includes(v))
      .forEach(([key, v]) => (customClaims[key] = v))
    await auth().setCustomUserClaims(token.uid, customClaims)
  }
  return { sucesso: true }
}

function validarRequisicao(req: IReqRemMembro) {
  if (!req.CNPJ) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo CNPJ da empresa ausente.'
    )
  }
}
