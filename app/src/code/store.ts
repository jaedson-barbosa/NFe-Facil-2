import { derived, Readable, readable, writable } from 'svelte/store'
import { collection, doc, limit, onSnapshot, query } from 'firebase/firestore'
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
  signIn: () => {
    localStorage.removeItem('idEmpresa')
    signInWithPopup(auth, googleProvider)
  },
  signOut: () => {
    localStorage.removeItem('idEmpresa')
    signOut(auth).then(location.reload)
  },
}

export const liberacoes = derived<
  Readable<User>,
  { cnpj: string; nivel: NiveisAcesso }[]
>(
  user,
  (ref, set) => {
    if (ref) {
      getIdTokenResult(ref, true)
        .then((token) =>
          set(
            Object.entries(token.claims)
              .filter(([_, v]) => v === NiveisAcesso.RW || v === NiveisAcesso.A)
              .map(([cnpj, v]) => ({ cnpj, nivel: v as NiveisAcesso }))
          )
        )
        .catch(() => set([]))
    } else set([])
  },
  []
)

interface IEmpresa {
  emit: any
  serieNFe: string
  serieNFCe: string
  IDCSC: string
  CSC: string
  IDCSCh: string
  CSCh: string
  tokenIBPT?: string
  logotipo?: {
    imagem: string
    alinhamento: 'L' | 'C' | 'R' | 'F'
    monocromatico: boolean
    tamanho: Tamanho
    pixelizacao: Metodo
  }
}

export interface IPerfilTributario {
  id: string
  descricao: string
  imposto: any
}

export const idEmpresa = localStorage.getItem('idEmpresa')
export const refEmpresa = idEmpresa && doc(db, 'empresas', idEmpresa)

export const empresa = writable<IEmpresa>(undefined)
if (refEmpresa) onSnapshot(refEmpresa, (v) => empresa.set(v.data() as IEmpresa))

export const perfisTributarios = writable<IPerfilTributario[]>([])
if (refEmpresa) {
  const colecao = collection(refEmpresa, Dados.Impostos)
  onSnapshot(query(colecao, limit(50)), (v) =>
    perfisTributarios.set(
      v.docs.map(
        (k) =>
          ({
            id: k.id,
            descricao: k.get('descricao'),
            imposto: k.get('imposto'),
          } as IPerfilTributario)
      )
    )
  )
}

export interface IEdicao {
  tipo: Dados
  id: string
  dado: any
}

export const edicao = writable<IEdicao>(undefined)
