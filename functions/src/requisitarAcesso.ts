import { onLoggedRequest } from './core'
import * as forge from 'node-forge'

export default onLoggedRequest(async (user, res, empresa, body) => {
	if (body.cert && body.senha) {
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

		const currentData = empresa.data()!
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
					empresa: currentData.emit
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
				empresa: currentData.emit
			})
		}
	} else if (body.cert) {
		res.status(400).send('Não foi informada a senha do certificado')
	} else if (body.senha) {
		res.status(400).send('Não foi selecionado nenhum certificado')
	} else {
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
			empresa: empresa.data()!.emit
		})
	}
})
