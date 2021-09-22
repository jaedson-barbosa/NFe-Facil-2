const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export default function idAleatorio(length = 20, proibidos = []) {
  const novoId = [...Array(length)]
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('')
  return proibidos.includes(novoId) ? idAleatorio(length, proibidos) : novoId
}
