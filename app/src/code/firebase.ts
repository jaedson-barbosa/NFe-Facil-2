import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
  FunctionsError,
} from 'firebase/functions'
import {
  IReqAddMembro,
  IReqCadastrar,
  IReqCancelar,
  IReqTransmitir,
  IResAddMembro,
  IResCadastrar,
  IResCancelar,
  IResTransmitir,
} from './tipos'
import { initializeApp } from 'firebase/app'
import {
  enableIndexedDbPersistence,
  getFirestore,
  connectFirestoreEmulator,
} from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAVyvaaQBSUF8y7kxrfLxg1v7u3JEP-6b4',
  authDomain: 'nfe-facil-980bc.firebaseapp.com',
  projectId: 'nfe-facil-980bc',
  storageBucket: 'nfe-facil-980bc.appspot.com',
  messagingSenderId: '966949369760',
  appId: '1:966949369760:web:7de508d5df6f8879dd56c5',
}

initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth()
const functions = getFunctions(undefined, 'southamerica-east1')

if (false) {
  connectFirestoreEmulator(db, 'localhost', 8080)
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFunctionsEmulator(functions, 'localhost', 5001)
}

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn('Mais de uma aba aberta ao mesmo tempo.')
  } else if (err.code == 'unimplemented') {
    console.warn('Navegador não suporta o modo offline')
  } else {
    console.error(err.message)
  }
})

export { db, auth, functions }

export const cadastrar = httpsCallable<IReqCadastrar, IResCadastrar>(
  functions,
  'cadastrar'
)

export const transmitirNFe = httpsCallable<IReqTransmitir, IResTransmitir>(
  functions,
  'transmitirNFe'
)

export const transmitirNFCe = httpsCallable<IReqTransmitir, IResTransmitir>(
  functions,
  'transmitirNFCe'
)

export const cancelarNF = httpsCallable<IReqCancelar, IResCancelar>(
  functions,
  'cancelarNF'
)

export const addMembro = httpsCallable<IReqAddMembro, IResAddMembro>(
  functions,
  'addMembro'
)

export function defaultCatch(error: FunctionsError) {
  console.log(error)
  let msg = error.message
  if (error.details) msg += '\n' + error.details
  alert(msg)
  return false
}
