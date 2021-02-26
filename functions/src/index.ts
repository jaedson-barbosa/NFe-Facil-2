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
		res.status(400).send('Nenhuma empresa')
		return
	}
	const empresas = await db.getAll(...cadastros.docs.map(v => v.ref.parent.parent!))
	const zip = empresas.map(v => {
		const cadastro = cadastros.docs.find(k => k.ref.parent.parent == v.ref)!.data()
		return {
			id: v.id,
			status: cadastro.status,
			permissoes: cadastro.permissoes,
			empresa: v.data()!.emit
		}
	})
	res.status(200).send(zip)
}))

export const scanRegistro = functions.https.onRequest((req, res) => cors(req, res, async () => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
		return
	}
	const cnpj = req.query.cnpj
	if (!cnpj) {
		res.status(400).send('CNPJ inválido')
		return
	}
	const empresas = await db.collection('empresas').where('CNPJ', '==', cnpj).select().limit(1).get()
	if (empresas.empty) {
		res.status(400).send('Empresa não existe')
		return
	}
	const empresa = empresas.docs[0]
	const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
	if (usuario.exists) res.status(200).send(usuario.data())
	else res.status(400).send('Usuário não cadastrado')
}))

function getRespostaTentativaCadastro(status: 0 | 1 | 2 | 3) {
	switch (status) {
		case 0:
			return 'Pedido ainda aguardando análise'
		case 1:
			return 'O acesso foi revogado por um administrador'
		case 2:
			return 'Acesso já estava liberado'
		case 3:
			return 'Usuário já é um administrador'
	}
}

export const requisitarAcesso = functions.https.onRequest((req, res) => cors(req, res, async () => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
		return
	}
	const cnpj = req.query.cnpj
	if (!cnpj) {
		res.status(400).send('CNPJ inválido')
		return
	}
	const body = req.body ? JSON.parse(req.body) : undefined
	if (body) {
		const pfx = body.cert
		if (!pfx) {
			res.status(400).send('Certificado inválido')
			return
		}
		const senha = body.senha
		if (!senha) {
			res.status(400).send('Senha inválida')
			return
		}
		const p12Der = forge.util.decode64(pfx);
		const p12Asn1 = forge.asn1.fromDer(p12Der);
		const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, senha);
		const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
		const pkeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
		const certBag = certBags[forge.pki.oids.certBag]![0];
		const keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag]![0];
		const privateKeyPem = forge.pki.privateKeyToPem(keybag.key!);
		const certificatePem = forge.pki.certificateToPem(certBag.cert!);

		const empresas = await db.collection('empresas').where('CNPJ', '==', cnpj).select().limit(1).get()
		if (empresas.empty) {
			res.status(400).send('Empresa não existe')
			return
		}
		const empresa = empresas.docs[0]
		const currentData = empresa.data()
		if (currentData.publicCert != certificatePem || currentData.privateCert != privateKeyPem) {
			res.status(400).send('Certificados não coincidem')
			return
		}
		const usuarioRef = empresa.ref.collection('usuarios').doc(user.sub)
		const usuario = await usuarioRef.get()
		if (usuario.exists) {
			const status = usuario.data()!.status
			if (status != 3) {
				await usuarioRef.update({
					status: 3,
					permissoes: null
				})
				res.status(200).send({
					idEmpresa: empresa.id,
					status: 'Usuário promovido para administrador',
					empresa: empresa.data().emit
				})
			} else {
				res.status(400).send(getRespostaTentativaCadastro(status))
			}
		} else {
			await usuarioRef.set({
				status: 3,
				nome: user.displayName
			})
			res.status(200).send({
				idEmpresa: empresa.id,
				status: 'Administrador registrado',
				empresa: empresa.data().emit
			})
		}
	} else {
		const empresas = await db.collection('empresas').where('CNPJ', '==', cnpj).select().limit(1).get()
		if (empresas.empty) {
			res.status(400).send('Empresa não existe')
			return
		}
		const empresa = empresas.docs[0]
		const usuarioRef = empresa.ref.collection('usuarios').doc(user.sub)
		const usuario = await usuarioRef.get()
		if (usuario.exists) {
			res.status(400).send(getRespostaTentativaCadastro(usuario.data()!.status))
			return
		}
		await usuarioRef.set({
			status: 0,
			nome: user.displayName
		})
		res.status(200).send({
			idEmpresa: empresa.id,
			status: 'Pedido registrado',
			empresa: empresa.data().emit
		})
	}
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
		res.status(400).send('Corpo de requisição inválido')
		return
	}
	const pfx = body.cert
	if (!pfx) {
		res.status(400).send('Certificado inválido')
		return
	}
	const senha = body.senha
	if (!senha) {
		res.status(400).send('Senha inválida')
		return
	}
	const emit = body.emit
	if (!emit) {
		res.status(400).send('Emitente inválido')
		return
	}
	//Interessante pôr análise de CA (autoridade certificadora)
	const p12Der = forge.util.decode64(pfx);
	const p12Asn1 = forge.asn1.fromDer(p12Der);
	const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, senha);
	const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
	const pkeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
	const certBag = certBags[forge.pki.oids.certBag]![0];
	const keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag]![0];
	const privateKeyPem = forge.pki.privateKeyToPem(keybag.key!);
	const cert = certBag.cert!
	const certificatePem = forge.pki.certificateToPem(cert);

	const certUser = cert.subject.getField('CN').value as string
	const certParts = certUser.split(':')
	if (certParts.length != 2) {
		res.status(400).send('Certificado inválido')
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
		res.status(400).send('Empresa já existe')
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
