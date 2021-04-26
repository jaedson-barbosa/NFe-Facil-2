import { onLoggedRequest } from './core'

export default onLoggedRequest(async (user, res, empresaRef) => {
  const usuario = await empresaRef.collection('usuarios').doc(user.sub).get()
  if (usuario.exists) res.status(200).send(usuario.data())
  else res.status(400).send('Usuário não cadastrado')
})
