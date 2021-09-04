import { initializeApp } from 'firebase-admin'
import { region } from 'firebase-functions'

initializeApp()

import _cadastrar from './cadastrar'
import _transmitirNFe from './transmitirNFe'
import _cancelarNFe from './cancelarNFe'

const regiao = region('southamerica-east1').https
export const cadastrar = regiao.onCall(_cadastrar)
export const transmitirNFe = regiao.onCall(_transmitirNFe)
export const cancelarNFe = regiao.onCall(_cancelarNFe)
