import { onRequest, db } from './core'

export default onRequest(true, async (user, res, body) => {
	const cnpj = body.cnpj
	if (!cnpj) {
		res.status(400).send('CNPJ inválido')
		return
	}
	const empresas = await db.collection('empresas').where('emit.CNPJ', '==', cnpj).select().limit(1).get()
	if (empresas.empty) {
		res.status(400).send('Empresa não existe')
		return
	}
	const empresa = empresas.docs[0]
	const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
	if (usuario.exists) res.status(200).send(usuario.data())
	else res.status(400).send('Usuário não cadastrado')
})