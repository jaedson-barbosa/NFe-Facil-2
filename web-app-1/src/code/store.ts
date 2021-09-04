import { derived, Readable, readable, Writable, writable } from 'svelte/store'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import type { DocumentReference } from 'firebase/firestore'
import {
  getAuth,
  GoogleAuthProvider,
  User,
  signInWithPopup,
  signOut,
  getIdTokenResult,
} from 'firebase/auth'
import type { Dados, NiveisAcesso } from './tipos'

const auth = getAuth()
const googleProvider = new GoogleAuthProvider()
const db = getFirestore()

export const user = {
  subscribe: readable<User>(undefined, (set) =>
    auth.onAuthStateChanged((u) => set(u))
  ).subscribe,
  signIn: () => signInWithPopup(auth, googleProvider),
  signOut: () => signOut(auth),
}

export const liberacoes = derived<
  Readable<User>,
  { cnpj: string; nivel: NiveisAcesso }[]
>(
  user,
  (ref, set) => {
    if (ref) {
      getIdTokenResult(ref, true)
        .then(({ claims }) => {
          const liberacoes = Object.entries(claims)
          const empresas = liberacoes.map(([cnpj, nivel]) => ({
            cnpj,
            nivel: nivel as unknown as NiveisAcesso,
          }))
          set(empresas)
        })
        .catch(() => set([]))
    } else set([])
  },
  []
)

export const idEmpresa = writable(localStorage.getItem('idEmpresa'))
idEmpresa.subscribe((v) => localStorage.setItem('idEmpresa', v))

type TEmpresa = {
  emit: any
  serieNFe: string
  serieNFCe: string
  IDCSC: string
  CSC: string
}

export const refEmpresa = derived<Writable<string>, DocumentReference>(
  idEmpresa,
  (id) => (id ? doc(db, 'empresas', id) : undefined),
  undefined
)

export const empresa = derived<Readable<DocumentReference>, TEmpresa>(
  refEmpresa,
  (ref, set) => {
    if (ref) getDoc(ref).then((v) => set(v.data() as TEmpresa))
    else set(undefined)
  },
  undefined
)

interface IEdicao {
  tipo: Dados
  id: string
  dado: any
}

export const edicao = writable<IEdicao>(undefined)
