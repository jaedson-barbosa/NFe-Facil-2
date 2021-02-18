import * as functions from "firebase-functions";
import * as firebase from 'firebase-admin'
import * as express from 'express'
const cors = require('cors')({ origin: true, allowedHeaders: 'Authorization' });
firebase.initializeApp()

async function getUser(req: any) {
	const authorizationHeader = req.headers.authorization || '';
	const components = authorizationHeader.split(' ');
	const idToken = components.length > 1 ? components[1] : '';
	if (idToken && idToken != ' ') {
		try {
			const decodedClaims = await firebase.auth().verifyIdToken(idToken)
			return decodedClaims
		} catch (error) {
			return undefined
		}
	}
	return undefined
}

const app = express()
app.use(cors)
app.get('/helloWorld', async (req: any, res: any) => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
	} else {
		res.status(200).send(user)
	}
})

export const api = functions.https.onRequest(app);

/*
================================	METAS	================================
*	Inserir todos os botões no painel
*	Criar páginas de dados base e de nota fiscal
*	Criar página de boas vindas básica
*	Criar página de perfil (cadastro de emitente)
	*	Emitente único, raros são aqueles com mais de uma empresa

*/
