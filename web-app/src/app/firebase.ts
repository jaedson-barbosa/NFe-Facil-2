import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

if (typeof firebase === 'undefined')
  throw new Error('Firebase SDK not detected.')
var firebaseConfig = {
  projectId: 'nfe-facil-980bc',
  appId: '1:966949369760:web:7de508d5df6f8879dd56c5',
  storageBucket: 'nfe-facil-980bc.appspot.com',
  locationId: 'southamerica-east1',
  apiKey: 'AIzaSyAVyvaaQBSUF8y7kxrfLxg1v7u3JEP-6b4',
  authDomain: 'nfe-facil-980bc.firebaseapp.com',
  messagingSenderId: '966949369760',
  measurementId: 'G-MJFSTKZX90',
}
if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig)

  var firebaseEmulators = {
    auth: {
      host: 'localhost',
      port: 9099,
    },
    firestore: {
      host: 'localhost',
      port: 8080,
    },
    functions: {
      host: 'localhost',
      port: 5001,
    },
  }
  if (firebaseEmulators) {
    if (
      firebaseEmulators.firestore &&
      typeof firebase.firestore === 'function'
    ) {
      firebase
        .firestore()
        .useEmulator(
          firebaseEmulators.firestore.host,
          firebaseEmulators.firestore.port
        )
    }

    if (
      firebaseEmulators.functions &&
      typeof firebase.functions === 'function'
    ) {
      firebase
        .functions()
        .useEmulator(
          firebaseEmulators.functions.host,
          firebaseEmulators.functions.port
        )
    }

    if (firebaseEmulators.auth && typeof firebase.auth === 'function') {
      firebase
        .auth()
        .useEmulator(
          'http://' +
            firebaseEmulators.auth.host +
            ':' +
            firebaseEmulators.auth.port
        )
    }
  }
}
const _auth = firebase.auth()
export const auth = _auth

const _googleProvider = new firebase.auth.GoogleAuthProvider()
export const googleProvider = _googleProvider

const _db = firebase.firestore()
export const db = _db
