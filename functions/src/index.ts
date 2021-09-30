import { initializeApp } from 'firebase-admin'
import { region } from 'firebase-functions'

initializeApp()

import _cadastrar from './cadastrar'
import _transmitirNFe from './transmitirNFe'
import _cancelarNFe from './cancelarNFe'
import _addMembro from './addMembro'

const https = region('southamerica-east1').https
export const cadastrar = https.onCall(_cadastrar)
export const transmitirNFe = https.onCall(_transmitirNFe)
export const cancelarNFe = https.onCall(_cancelarNFe)
export const addMembro = https.onCall(_addMembro)
