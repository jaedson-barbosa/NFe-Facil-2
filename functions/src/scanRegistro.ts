import { onLoggedRequest } from './core'

export default onLoggedRequest(async (user, res, empresaRef, empresa, body) => {
  const usuario = await empresaRef.collection('usuarios').doc(user.sub).get()
  if (usuario.exists) {
    const data = usuario.data()!
    res.status(200).send({
      id: empresaRef.id,
      status: data.status,
      emit: empresa.emit,
      serieAtual: empresa.serieAtual,
    })
  } else res.status(400).send('Usuário não cadastrado')
})
