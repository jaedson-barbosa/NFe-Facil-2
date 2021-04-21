import { onDefaultRequest, db } from './core'

export default onDefaultRequest(false, async (user, res) => {
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
})