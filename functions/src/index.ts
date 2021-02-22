import * as functions from "firebase-functions";
import * as firebase from 'firebase-admin'
const cors = require('cors')({ origin: true, allowedHeaders: 'Authorization' });
firebase.initializeApp()
const db = firebase.firestore()
// const FieldValue = firebase.firestore.FieldValue
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

export const scanUsuario = functions.https.onRequest((req, res) => cors(req, res, async () => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
		return
	}
	const empresas = await db.collectionGroup('usuarios').where(FieldPath.documentId(), '==', user.sub).get()
	if (empresas.empty) {
		res.status(200).send('Nenhuma empresa')
		return
	}
	
}))

export const scanCNPJ = functions.https.onRequest((req, res) => cors(req, res, async () => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
		return
	}
	const cnpj = req.query.cnpj
	if (!cnpj) {
		res.sendStatus(400)
		return
	}
	const empresas = await db.collection('empresas').where('CNPJ', '==', cnpj).select().limit(1).get()
	if (empresas.empty) {
		res.status(200).send('Empresa não existe')
		return
	}
	const empresa = empresas.docs[0]
	const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
	if (usuario.exists) res.status(200).send(usuario.data())
	else res.status(200).send('Usuário não existe')
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
