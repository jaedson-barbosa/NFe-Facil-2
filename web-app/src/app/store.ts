import { auth, db, googleProvider } from './firebase'
import { derived, Readable, readable, Writable, writable } from 'svelte/store'

export const user = {
  subscribe: readable<firebase.default.User>(undefined, (set) => {
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
      const unsub = ref.onSnapshot((v) => {
        if (v.exists) set(v.data() as TEmpresa)
        else set(undefined)
      })
      return () => {
        alert('Unsub chamado.')
        unsub()
        alert('Removido listener.')
      }
    } else set(undefined)
  },
  undefined
)

type TDocument = firebase.default.firestore.DocumentData
type TReference = firebase.default.firestore.DocumentReference<TDocument>
export type TColumn = firebase.default.firestore.CollectionReference<TDocument>

interface IColumns {
  clientes: TColumn
  transportes: TColumn
  produtos: TColumn
  notasSalvas: TColumn
  notasEmitidas: TColumn
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
    } as IColumns
  },
  undefined
)
