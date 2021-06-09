import { Response, HttpsFunction, https } from 'firebase-functions'
import { auth } from 'firebase-admin'

const cors = require('cors')({
  origin: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
})

async function getUser(req: any): Promise<auth.DecodedIdToken | undefined> {
  const authorizationHeader = req.headers.authorization || ''
  const components = authorizationHeader.split(' ')
  const idToken = components.length > 1 ? components[1] : ''
  if (idToken && idToken != ' ') {
    try {
      const decodedClaims = await auth().verifyIdToken(idToken)
      return decodedClaims
    } catch (error) {}
  }
  return undefined
}

export interface IDefaultParams {
  user: auth.DecodedIdToken
  body: any
}

export function onDefaultRequest(
  handler: (params: IDefaultParams, resp: Response<any>) => Promise<void>
): HttpsFunction {
  return https.onRequest((req, res) =>
    cors(req, res, async () => {
      const user = await getUser(req)
      if (!user) {
        res.sendStatus(401)
        return
      }
      const body = req.body ? JSON.parse(req.body) : undefined
      if (!body) {
        res.status(400).send('Corpo de requisição não informado')
        return
      }
      try {
        await handler({ user, body }, res)
      } catch (error) {
        const e = error as Error
        res
          .status(400)
          .send(`Erro: ${e.name}: ${e.message}.\nCaminho: ${e.stack}`)
      }
    })
  )
}
