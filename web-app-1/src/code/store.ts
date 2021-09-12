import { derived, Readable, readable, Writable, writable } from 'svelte/store'
import { doc, getDoc } from 'firebase/firestore'
import type { DocumentReference } from 'firebase/firestore'
import {
  GoogleAuthProvider,
  User,
  signInWithPopup,
  signOut,
  getIdTokenResult,
} from 'firebase/auth'
import { Dados, NiveisAcesso } from './tipos'
import { auth, db } from './firebase'

const googleProvider = new GoogleAuthProvider()

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
          const niveis = [NiveisAcesso.R, NiveisAcesso.RW, NiveisAcesso.A]
          const liberacoes = Object.entries(claims)
          const empresas = liberacoes
            .filter(([_, v]) => niveis.includes(v as NiveisAcesso))
            .map(([cnpj, v]) => ({ cnpj, nivel: v as NiveisAcesso }))
          set(empresas)
        })
        .catch(() => set([]))
    } else set([])
  },
  []
)

export const idEmpresa = writable(localStorage.getItem('idEmpresa'))
idEmpresa.subscribe((v) =>
  v
    ? localStorage.setItem('idEmpresa', v)
    : localStorage.removeItem('idEmpresa')
)

export const liberacao = derived(
  [liberacoes, idEmpresa],
  ([$liberacoes, $idEmpresa]) =>
    $liberacoes?.find((v) => v.cnpj == $idEmpresa)?.nivel
)

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
