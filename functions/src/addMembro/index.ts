import * as admin from 'firebase-admin'
import { https } from 'firebase-functions'
import { IReqAddMembro, IResAddMembro, NiveisAcesso } from '../commom/tipos'
import validarAutenticacao from '../commom/validarAutenticacao'
import validarPermissao from '../commom/validarPermissao'

const { auth } = admin

export default async function (
  req: IReqAddMembro,
  context: https.CallableContext
): Promise<IResAddMembro> {
  validarAutenticacao(context)
  validarRequisicao(req)
  const token = context.auth!.token
  validarPermissao(token, req.CNPJ, true)
  try {
    const novo = await auth().getUser(req.idNovo)
    await registrarUsuario(req.CNPJ, req.escrita, novo)
    return { sucesso: true }
  } catch (error: any) {
    throw new https.HttpsError(
      'failed-precondition',
      'Não foi possível encontrar um usuário com este ID.',
      error.message
    )
  }
}

function validarRequisicao(req: IReqAddMembro) {
  if (!req.CNPJ) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo CNPJ da empresa ausente.'
    )
  }
  if (!req.idNovo) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo ID de usuário ausente.'
    )
  }
  if (req.escrita) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo permissão de escrita ausente.'
    )
  }
}

async function registrarUsuario(
  CNPJ: string,
  escrita: boolean,
  userRecord: admin.auth.UserRecord
) {
  const nivel = escrita ? NiveisAcesso.RW : NiveisAcesso.R
  const liberacoes = { ...userRecord.customClaims, [CNPJ]: nivel }
  await auth().setCustomUserClaims(userRecord.uid, liberacoes)
}
