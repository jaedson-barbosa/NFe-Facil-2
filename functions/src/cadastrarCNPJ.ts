import { cors, functions, db, forge, FieldValue, getUser } from './core'

export default functions.https.onRequest((req, res) => cors(req, res, async () => {
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
	if (cnpj != emit.CNPJ) {
		//CNPJ do certificado é diferente do CNPJ informado no cadastro
		res.status(400).send(`CNPJ diferente ${certUser}`)
		return
	}

	// const certificatePem = forge.pki.certificateToPem(cert!);
	const empresas = await db.collection('empresas').where('CNPJ', '==', cnpj).select().limit(1).get()
	if (!empresas.empty) {
		res.status(400).send('Empresa já existe')
		return
	}
	try {
		const empresaRef = db.collection('empresas').doc()
		await empresaRef.set({
			publicCert: certificatePem,
			privateCert: privateKeyPem,
			emit: emit,
			lastUpdate: FieldValue.serverTimestamp()
		})
		await empresaRef.collection('usuarios').doc(user.sub).set({
			status: 3,
			nome: user.email ?? 'Anônimo',
			id: user.sub
		})
		res.status(200).send(empresaRef.id)
	} catch (error) {
		res.status(200).send('Erro')
	}
}))