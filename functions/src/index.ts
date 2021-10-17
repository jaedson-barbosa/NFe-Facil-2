import * as admin from 'firebase-admin'
import { region } from 'firebase-functions'

admin.initializeApp()

import _cadastrar from './cadastrar'
import _transmitirNFe from './transmitirNFe'
import _transmitirNFCe from './transmitirNFCe'
import _cancelarNF from './cancelarNF'
import _addMembro from './acesso/liberar'
import _remMembro from './acesso/bloquear'

const https = region('southamerica-east1').https
export const cadastrar = https.onCall(_cadastrar)
export const transmitirNFe = https.onCall(_transmitirNFe)
export const transmitirNFCe = https.onCall(_transmitirNFCe)
export const cancelarNF = https.onCall(_cancelarNF)
export const addMembro = https.onCall(_addMembro)
export const remMembro = https.onCall(_remMembro)
