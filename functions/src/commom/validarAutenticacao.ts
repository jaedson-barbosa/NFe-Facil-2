import { https } from 'firebase-functions'

export default function (context: https.CallableContext) {
  if (!context.auth) {
    throw new https.HttpsError(
      'failed-precondition',
      'A função apenas pode ser chamada por um usuário autenticado.'
    )
  }
}
