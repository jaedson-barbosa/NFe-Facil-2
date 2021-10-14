import { https } from 'firebase-functions'

const mensagemLimiteAtingido =
  'Foi tentado autorizar a nota fiscal com 5 números seguidos e todos já ' +
  'foram emitidos. Caso você tenha emitido algumas notas em outro emissor, ' +
  'por favor, importe todas as novas notas emitidas ou então preencha ' +
  'manualmente o campo de número da nota fiscal.'
export const erroDesistencia = new https.HttpsError(
  'aborted',
  mensagemLimiteAtingido
)
