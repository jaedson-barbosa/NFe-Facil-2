import { HttpsFunction, region, https } from 'firebase-functions'

export function onDefaultRequest(
  handler: (data: any, context: https.CallableContext) => Promise<any>
): HttpsFunction {
  return region('southamerica-east1').https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new https.HttpsError(
        'failed-precondition',
        'A função apenas pode ser chamada por um usuário autenticado.'
      )
    }
    try {
      return await handler(data, context)
    } catch(error) {
      if (error instanceof https.HttpsError) {
        throw error
      } else if (error instanceof Error) {
        throw new https.HttpsError(
          'internal',
          error.message,
          error.stack
        )
      } else {
        throw new https.HttpsError(
          'unknown',
          'Ocorreu um erro desconhecido durante a execução da função.'
        )
      }
    }
  })
}
