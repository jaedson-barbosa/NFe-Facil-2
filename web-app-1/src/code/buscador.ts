import {
  collection,
  DocumentReference,
  DocumentSnapshot,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  where,
} from 'firebase/firestore'
import { debounce } from 'lodash-es'
import { Dados } from './tipos'

export class Buscador {
  cadastros: DocumentSnapshot[] = []

  private _lastBusca = ''

  get lastBusca() {
    return this._lastBusca
  }

  private set lastBusca(value: string) {
    this._lastBusca = value
  }

  private _hasMore = false

  get hasMore() {
    return this._hasMore
  }

  private set hasMore(value: boolean) {
    this._hasMore = value
  }

  private _busca = ''

  get busca() {
    return this._busca
  }

  set busca(value: string) {
    this._busca = value
    debounce(() => this.buscar(value), 300)
  }

  constructor(
    private readonly refEmpresa: DocumentReference,
    private readonly dados: Dados,
    private readonly campoPrincipal: string
  ) {
    this.buscar()
  }

  carregarMais() {
    if (!this.hasMore) return
    this.buscar()
  }

  private async buscar(busca: string = this.lastBusca) {
    this.hasMore = false
    const coluna = collection(this.refEmpresa, this.dados)
    const limites: QueryConstraint[] = [
      limit(10),
      orderBy(this.campoPrincipal, 'desc'),
    ]
    if (busca != this.lastBusca) {
      this.cadastros = []
      limites.push(where(this.campoPrincipal, '>=', busca))
    } else if (this.cadastros.length) {
      const ultimo = this.cadastros[this.cadastros.length - 1]
      limites.push(startAfter(ultimo))
    }
    const consulta = query(coluna, ...limites)
    const docs = await getDocs(consulta)
    this.hasMore = docs.size == 10
    this.cadastros = [...this.cadastros, ...docs.docs]
    this.lastBusca = busca
  }
}
