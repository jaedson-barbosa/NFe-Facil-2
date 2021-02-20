import * as functions from "firebase-functions";
import * as firebase from 'firebase-admin'
const cors = require('cors')({ origin: true, allowedHeaders: 'Authorization' });
firebase.initializeApp()
// const db = firebase.firestore()
// const FieldValue = firebase.firestore.FieldValue

async function getUser(req: any) {
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

export const test = functions.https.onRequest((req, res) => cors(req, res, async () => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
	} else {
		res.status(200).send(user)
	}
}))

/*
================================	METAS	================================
*	Sistemas de gerenciamento
	*	Notas
	*	Emitentes
	*	Clientes
	*	Produtos
	*	Transportadores
	*	Veículos
*	Toodos os botões no painel
*	Páginas de dados base e de nota fiscal
*	Página de boas vindas básica
*	Página de perfil (cadastro de emitente)
	*	Emitente único, raros são aqueles com mais de uma empresa
* POR ENQUANTO FAZER TUDO FUNCIONAR LOCALMENTE, SEM SINCRONIZAÇÃO
*/
