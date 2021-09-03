import { initializeApp } from 'firebase-admin'
import { region, https } from 'firebase-functions'

initializeApp()

import cadastrarFunc from './cadastrar'
export { transmitirNFe } from './transmitirNFe'
export { cancelarNFe } from './cancelarNFe'

type genericFunc = (data: any, context: https.CallableContext) => Promise<any>
function create(func: genericFunc) {
  return region('southamerica-east1').https.onCall(func)
}

export const cadastrar = create(cadastrarFunc)
