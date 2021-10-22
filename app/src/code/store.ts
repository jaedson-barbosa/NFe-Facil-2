import { derived, Readable, readable, Writable, writable } from 'svelte/store'
import { doc, onSnapshot } from 'firebase/firestore'
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
import { Tamanho } from './impressao-nfce/configuracao'
import { Metodo } from './impressao-nfce/pixelizacao'

const googleProvider = new GoogleAuthProvider()

export const carregando = writable(false)
const carregandoEl = document.getElementById('carregando')
carregando.subscribe((v) => (carregandoEl.className = v ? '' : 'desativado'))

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
          const niveis = [NiveisAcesso.RW, NiveisAcesso.A]
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
  IDCSCh: string
  CSCh: string
  tokenIBPT?: string,
  logotipo?: {
    imagem: string
    alinhamento: 'L' | 'C' | 'R' | 'F'
    monocromatico: boolean
    tamanho: Tamanho
    pixelizacao: Metodo
  }
}

export const refEmpresa = derived<Writable<string>, DocumentReference>(
  idEmpresa,
  (id) => (id ? doc(db, 'empresas', id) : undefined),
  undefined
)

export const empresa = writable<TEmpresa>(undefined)
let terminarEmpesa = undefined
user.subscribe(($user) => {
  if ($user) {
    refEmpresa.subscribe((ref) => {
      if (ref) {
        terminarEmpesa = onSnapshot(ref, (v) => {
          const data = v.data() as TEmpresa
          empresa.set(data)
        })
      } else {
        terminarEmpesa?.()
        empresa.set(undefined)
      }
    })
  } else {
    terminarEmpesa?.()
    empresa.set(undefined)
  }
})

export interface IEdicao {
  tipo: Dados
  id: string
  dado: any
}

export const edicao = writable<IEdicao>(undefined)
