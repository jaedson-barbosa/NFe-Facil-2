import * as functions from 'firebase-functions'
import * as firebase from 'firebase-admin'
import * as forge from 'node-forge'

firebase.initializeApp()
const cors = require('cors')({ origin: true, allowedHeaders: ['Content-Type', 'Authorization'] })
const db = firebase.firestore()
const FieldValue = firebase.firestore.FieldValue
const FieldPath = firebase.firestore.FieldPath

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

export {
    functions,
    firebase,
    forge,
    cors,
    db,
    FieldValue,
    FieldPath,
    getUser
}