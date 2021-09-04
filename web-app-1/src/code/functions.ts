import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
  FunctionsError,
} from 'firebase/functions'
import type {
  IReqCadastrar,
  IReqCancelar,
  IReqTransmitir,
  IResCadastrar,
  IResCancelar,
  IResTransmitir,
} from './tipos'

const functions = getFunctions(undefined, 'southamerica-east1')

connectFunctionsEmulator(functions, 'localhost', 5001)

export const cadastrar = httpsCallable<IReqCadastrar, IResCadastrar>(
  functions,
  'cadastrar'
)

export const transmitirNFe = httpsCallable<IReqTransmitir, IResTransmitir>(
  functions,
  'transmitirNFe'
)

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
