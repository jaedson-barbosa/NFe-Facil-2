import {
  derived,
  Readable,
  readable,
  Writable,
  writable,
  get,
} from 'svelte/store'
import { Dados } from './dados'

const auth = firebase.auth()
const googleProvider = new firebase.auth.GoogleAuthProvider()
const db = firebase.firestore()

export const user = {
  subscribe: readable<firebase.User>(undefined, (set) =>
    auth.onAuthStateChanged((u) => set(u))
  ).subscribe,
  signIn: () => auth.signInWithPopup(googleProvider),
  signOut: () => auth.signOut(),
}

export const idEmpresa = writable(localStorage.getItem('idEmpresa'))
idEmpresa.subscribe((v) => localStorage.setItem('idEmpresa', v))

type TEmpresa = {
  emit: any
  serieNFe: string
  serieNFCe: string
  IDCSC: string
  CSC: string
}

export const empresaRef = derived<Writable<string>, TReference>(
  idEmpresa,
  (id) => (id ? db.collection('empresas').doc(id) : undefined),
  undefined
)

export const userStatus = derived<Readable<TReference>, number>(
  empresaRef,
  (ref, set) => {
    if (ref) {
      ref
        .collection('usuarios')
        .doc(get(user).uid)
        .get()
        .then((v) => set(v.exists ? v.get('status') : -1))
        .catch(() => set(-1))
    } else set(-1)
  },
  undefined
)

export const empresa = derived<Readable<TReference>, TEmpresa>(
  empresaRef,
  (ref, set) => {
    if (ref) return ref.onSnapshot(v => set(v.exists ? v.data() as TEmpresa : undefined))
    else set(undefined)
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
  notasCSalvas: TColumn
  notasCEmitidas: TColumn
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
      notasCSalvas: ref.collection('notasCSalvas'),
      notasCEmitidas: ref.collection('notasCEmitidas'),
      usuarios: ref.collection('usuarios'),
    } as IColumns
  },
  undefined
)

interface IEdicao {
  tipo: Dados,
  id: string,
  dado: any
}

export const edicao = writable<IEdicao>(undefined)
