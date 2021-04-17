import { cors, functions, db, getUser } from './core'

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
	const empresas = await db.collection('empresas').where('emit.CNPJ', '==', cnpj).select().limit(1).get()
	if (empresas.empty) {
		res.status(400).send('Empresa não existe')
		return
	}
	const empresa = empresas.docs[0]
	const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
	if (usuario.exists) res.status(200).send(usuario.data())
	else res.status(400).send('Usuário não cadastrado')
}))