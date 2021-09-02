import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
  FunctionsError,
} from 'firebase/functions'

const functions = getFunctions(undefined, 'southamerica-east1')
connectFunctionsEmulator(functions, 'localhost', 5001)
export const precadastro = httpsCallable(functions, 'precadastro')
export const transmitirNFe = httpsCallable(functions, 'transmitirNFe')

export const cancelarNFe = httpsCallable<IReqCancelar, IResCancelar>(
  functions,
  'cancelarNFe'
)

export function defaultCatch(error: FunctionsError) {
  console.log(error)
  let msg = error.message
  if (error.details) msg += '\n' + error.details
  alert(msg)
  return false
}
