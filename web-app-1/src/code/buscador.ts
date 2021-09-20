import {
  collection,
  DocumentReference,
  DocumentSnapshot,
  getDocs,
  limit,
  orderBy,
  OrderByDirection,
  query,
  QueryConstraint,
  startAfter,
  where,
} from 'firebase/firestore'
import { debounce } from 'lodash-es'
import { Dados } from './tipos'

export class Buscador {
  private cadastros: DocumentSnapshot[] = []
  private lastBusca = ''

  private _hasMore = false

  get hasMore() {
    return this._hasMore
  }

  private set hasMore(value: boolean) {
    this._hasMore = value
  }

  readonly buscar = debounce((e: any) => this._buscar(e.target.value), 300)
  readonly carregarMais = () => this.hasMore && this._buscar()
  readonly operadorBusca: '>=' | '<='

  constructor(
    private readonly refEmpresa: DocumentReference,
    private readonly dados: Dados,
    private readonly campoPrincipal: string,
    private readonly direcao: OrderByDirection,
    private readonly onUpdateCadastros: (cadastros: DocumentSnapshot[]) => void
  ) {
    this.operadorBusca = direcao == 'asc' ? '>=' : '<='
    this._buscar()
  }

  private async _buscar(busca: string = this.lastBusca) {
    this.hasMore = false
    const coluna = collection(this.refEmpresa, this.dados)
    const limites: QueryConstraint[] = [
      limit(5),
      orderBy(this.campoPrincipal, this.direcao),
    ]
    if (busca != this.lastBusca) {
      this.cadastros = []
      limites.push(where(this.campoPrincipal, this.operadorBusca, busca))
    } else if (this.cadastros.length) {
      const ultimo = this.cadastros[this.cadastros.length - 1]
      limites.push(startAfter(ultimo.get(this.campoPrincipal)))
    }
    const consulta = query(coluna, ...limites)
    const docs = await getDocs(consulta)
    this.hasMore = docs.size == 10
    const cadastros = [...this.cadastros, ...docs.docs]
    this.cadastros = cadastros
    this.onUpdateCadastros(cadastros)
    this.lastBusca = busca
  }
}
