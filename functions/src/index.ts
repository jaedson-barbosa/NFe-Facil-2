import * as functions from "firebase-functions";
import * as firebase from 'firebase-admin'
import * as forge from 'node-forge'
const cors = require('cors')({ origin: true, allowedHeaders: ['Content-Type', 'Authorization'] });
firebase.initializeApp()
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

export const scanUsuario = functions.https.onRequest((req, res) => cors(req, res, async () => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
		return
	}
	const cadastros = await db.collectionGroup('usuarios').where(FieldPath.documentId(), '==', user.sub).get()
	if (cadastros.empty) {
		res.status(200).send('Nenhuma empresa')
		return
	}
	const empresas = await db.getAll(...cadastros.docs.map(v => v.ref.parent.parent!))
	const zip = empresas.map(v => {
		const cadastro = cadastros.docs.find(k => k.ref.parent.parent == v.ref)!
		return {
			id: v.id,
			isAdmin: cadastro.data().isAdmin,
			permissoes: cadastro.data().permissoes,
			empresa: v.data()
		}
	})
	res.status(200).send(zip)
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
	else res.status(200).send('Usuário não cadastrado')
}))

export const requisitarAcesso = functions.https.onRequest((req, res) => cors(req, res, async () => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
		return
	}
	res.sendStatus(200)
}))

export const cadastrarCNPJ = functions.https.onRequest((req, res) => cors(req, res, async () => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
		return
	}
	const body = req.body ? JSON.parse(req.body) : undefined
	if (!body) {
		res.sendStatus(400)
		return
	}
	const pfx = body.cert
	if (!pfx) {
		res.sendStatus(400)
		return
	}
	const emit = body.emit
	if (!emit) {
		res.sendStatus(400)
		return
	}
	//Interessante pôr análise de CA (autoridade certificadora)
	const p12Der = forge.util.decode64(pfx);
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, '12345678');
    const certBags = p12.getBags({bagType: forge.pki.oids.certBag});
    const pkeyBags = p12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
    const certBag = certBags[forge.pki.oids.certBag]![0];
    const keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag]![0];
    const privateKeyPem = forge.pki.privateKeyToPem(keybag.key!);
	const cert = certBag.cert!
	var certificatePem = forge.pki.certificateToPem(cert);

	const certUser = cert.subject.getField('CN').value as string
	const certParts = certUser.split(':')
	if (certParts.length != 2) {
		res.sendStatus(400)
		return
	}
	const cnpj = certParts[1]
	if (cnpj != emit.cnpj) {
		//CNPJ do certificado é diferente do CNPJ informado no cadastro
		res.status(400).send('CNPJ diferente')
		return
	}
	
    // const certificatePem = forge.pki.certificateToPem(cert!);
	const empresas = await db.collection('empresas').where('CNPJ', '==', cnpj).select().limit(1).get()
	if (!empresas.empty) {
		res.status(200).send('Empresa já existe')
		return
	}
	const added = await db.collection('empresas').add({
		publicCert: certificatePem,
		privateCert: privateKeyPem,
		emit: emit,
		lastUpdate: FieldValue.serverTimestamp()
	})
	res.status(200).send(added.id)
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
