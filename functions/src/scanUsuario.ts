import { cors, functions, db, getUser } from './core'

export default functions.https.onRequest((req, res) => cors(req, res, async () => {
	const user = await getUser(req);
	if (!user) {
		// Usuário não foi encontrado, então apenas se rejeita a requisição.
		res.sendStatus(401)
		return
	}
	const cadastros = await db.collectionGroup('usuarios').where('id', '==', user.sub).get()
	if (cadastros.empty) {
		res.status(400).send('Nenhuma empresa')
		return
	}
	const empresas = await db.getAll(
		...cadastros.docs.map(v => v.ref.parent.parent!))
	const zip = empresas.map(v => {
		const cadastro = cadastros.docs.find(
			k => k.ref.parent.parent?.id === v.ref.id
		)!.data()
		return {
			id: v.id,
			status: cadastro.status,
			permissoes: cadastro.permissoes,
			empresa: v.data()!.emit
		}
	})
	res.status(200).send(zip)
}))