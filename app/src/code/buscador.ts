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

  readonly buscar = debounce((e: any) => this._buscar(e.target.value), 250)
  readonly carregarMais = () => this.hasMore && this._buscar()
  readonly operadorBusca: '>=' | '<='

  private readonly limite: number

  constructor(
    private readonly refEmpresa: DocumentReference,
    private readonly dados: Dados,
    public readonly campoPrincipal: string,
    private readonly direcao: OrderByDirection,
    private readonly onUpdateCadastros: (cadastros: DocumentSnapshot[]) => void,
    simplificado: boolean,
    private readonly campoOrdenacao = campoPrincipal
  ) {
    this.operadorBusca = direcao == 'asc' ? '>=' : '<='
    this.limite = simplificado ? 4 : 10
    this._buscar()
  }

  private async _buscar(busca = this.lastBusca) {
    this.hasMore = false
    const coluna = collection(this.refEmpresa, this.dados)
    const limites: QueryConstraint[] = [
      limit(this.limite),
      orderBy(this.campoOrdenacao, this.direcao),
    ]
    if (busca != this.lastBusca) {
      this.cadastros = []
      limites.push(where(this.campoPrincipal, this.operadorBusca, busca))
    } else if (this.cadastros.length) {
      const ultimo = this.cadastros[this.cadastros.length - 1]
      const campoUltimo = ultimo.get(this.campoOrdenacao)
      limites.push(startAfter(campoUltimo))
    }
    const consulta = query(coluna, ...limites)
    const docs = await getDocs(consulta)
    this.hasMore = docs.size == this.limite
    const cadastros = [...this.cadastros, ...docs.docs]
    this.cadastros = cadastros
    this.onUpdateCadastros(cadastros)
    this.lastBusca = busca
  }
}
