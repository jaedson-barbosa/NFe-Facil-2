import { derived, Readable, readable, Writable, writable } from 'svelte/store'
import firebase from './firebase' //Usa os arquivos do hosting pra economizar no bundle

const auth = firebase.auth()
const googleProvider = new firebase.auth.GoogleAuthProvider()
const db = firebase.firestore()

export const user = {
  subscribe: readable<firebase.User>(undefined, (set) => {
    const unsubscribe = auth.onAuthStateChanged((u) => set(u))
    return () => unsubscribe()
  }).subscribe,
  signIn: () => auth.signInWithPopup(googleProvider), //auth.signInAnonymously(),
  signOut: () => auth.signOut(),
}

export const idEmpresa = writable('')

type TEmpresa = {
  emit: any
  serieNFe: string
  serieNFCe: string
}

export const empresaRef = derived<Writable<string>, TReference>(
  idEmpresa,
  (id) => (id ? db.collection('empresas').doc(id) : undefined),
  undefined
)

export const empresa = derived<Readable<TReference>, TEmpresa>(
  empresaRef,
  (ref, set) => {
    if (ref) {
      return ref.onSnapshot((v) => {
        if (v.exists) set(v.data() as TEmpresa)
        else set(undefined)
      })
    } else set(undefined)
  },
  undefined
)

export type TDocument = firebase.firestore.DocumentData
export type TReference = firebase.firestore.DocumentReference<TDocument>
export type TColumn = firebase.firestore.CollectionReference<TDocument>

interface IColumns {
  clientes: TColumn
  transportes: TColumn
  produtos: TColumn
  notasSalvas: TColumn
  notasEmitidas: TColumn
  usuarios: TColumn
}

export const dbColumns = derived<Readable<TReference>, IColumns>(
  empresaRef,
  (ref) => {
    if (!ref) return undefined
    return {
      clientes: ref.collection('clientes'),
      transportes: ref.collection('transportes'),
      produtos: ref.collection('produtos'),
      notasSalvas: ref.collection('notasSalvas'),
      notasEmitidas: ref.collection('notasEmitidas'),
      usuarios: ref.collection('usuarios')
    } as IColumns
  },
  undefined
)
