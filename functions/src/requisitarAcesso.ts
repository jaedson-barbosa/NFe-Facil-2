import { cors, functions, db, forge, getUser } from './core'

export default functions.https.onRequest((req, res) => cors(req, res, async () => {
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

		const empresas = await db.collection('empresas').where('emit.CNPJ', '==', cnpj).select().limit(1).get()
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
					id: empresa.id,
					status: 3,
					empresa: empresa.data().emit
				})
			} else {
				res.status(400).send(status)
			}
		} else {
			await usuarioRef.set({
				status: 3,
				nome: user.displayName,
				id: user.sub
			})
			res.status(200).send({
				id: empresa.id,
				status: 3,
				empresa: empresa.data().emit
			})
		}
	} else {
		const empresas = await db.collection('empresas').where('emit.CNPJ', '==', cnpj).select().limit(1).get()
		if (empresas.empty) {
			res.status(400).send('Empresa não existe')
			return
		}
		const empresa = empresas.docs[0]
		const usuarioRef = empresa.ref.collection('usuarios').doc(user.sub)
		const usuario = await usuarioRef.get()
		if (usuario.exists) {
			res.status(400).send(usuario.data()!.status)
			return
		}
		await usuarioRef.set({
			status: 0,
			nome: user.displayName,
			id: user.sub
		})
		res.status(200).send({
			id: empresa.id,
			status: 0,
			empresa: empresa.data().emit
		})
	}
}))
