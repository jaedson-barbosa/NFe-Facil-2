import * as functions from 'firebase-functions'
import * as firebase from 'firebase-admin'

firebase.initializeApp()
const cors = require('cors')({ origin: true, allowedHeaders: ['Content-Type', 'Authorization'] })
export const db = firebase.firestore()
export const FieldValue = firebase.firestore.FieldValue
// export const FieldPath = firebase.firestore.FieldPath

async function getUser(req: any): Promise<firebase.auth.DecodedIdToken | undefined> {
	const authorizationHeader = req.headers.authorization || '';
	const components = authorizationHeader.split(' ');
	const idToken = components.length > 1 ? components[1] : '';
	if (idToken && idToken != ' ') {
		try {
			const decodedClaims = await firebase.auth().verifyIdToken(idToken)
			return decodedClaims
		} catch (error) { }
	}
	return undefined
}

export function onDefaultRequest(
	bodyRequired: boolean,
	handler: (
		user: firebase.auth.DecodedIdToken,
		resp: functions.Response<any>,
		body: any
	) => Promise<void>
) : functions.HttpsFunction {
	return functions.https.onRequest(
		(req, res) => cors(
			req, res, async () => {
				const user = await getUser(req);
				if (!user) {
					res.sendStatus(401)
					return
				}
				const body = req.body ? JSON.parse(req.body) : undefined
				if (!body && bodyRequired) {
					res.status(400).send('Corpo de requisição não informado')
					return
				}
				await handler(user, res, body)
			}
		)
	)
}

export function onLoggedRequest(
	handler: (
		user: firebase.auth.DecodedIdToken,
		resp: functions.Response<any>,
		company: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
		body: any
	) => Promise<void>
) : functions.HttpsFunction {
	return onDefaultRequest(
		true,
		async (u, r, b) => {
			const cnpj = b.cnpj
			const id = b.id
			if (!cnpj && !id) {
				r.status(400).send('Requisição sem identificação de emitente.')
			} else if (cnpj) {
				const empresas = await db
					.collection('empresas')
					.where('emit.CNPJ', '==', cnpj)
					.select().limit(1).get()
				if (empresas.empty) {
					r.status(400).send('Empresa não existe')
				} else {
					await handler(u, r, empresas.docs[0], b)
				}
			} else {
				const empresa = await db.collection('empresas').doc(id).get()
				if (!empresa.exists) {
					r.status(400).send('Empresa não existe')
				} else {
					await handler(u, r, empresa, b)
				}
			}
		}
	)
}
