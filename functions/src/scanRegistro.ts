import { onLoggedRequest } from './core'

export default onLoggedRequest(async (user, res, empresa) => {
	const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
	if (usuario.exists) res.status(200).send(usuario.data())
	else res.status(400).send('Usuário não cadastrado')
})