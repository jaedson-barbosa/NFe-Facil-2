<script lang="ts">
  import { db } from '@app/firebase'
  import { url } from '@roxi/routify'

  export let idEmpresa: string
  export let coluna: 'notasSalvas' | 'notasEmitidas'

  type typeCadastro =
    firebase.default.firestore.QueryDocumentSnapshot<firebase.default.firestore.DocumentData>
  let cadastros: typeCadastro[] = []

  let loading = false
  let hasMore = false
  const limitedQuery = db
    .collection('empresas')
    .doc(idEmpresa)
    .collection(coluna)
    .limit(10)

  async function load() {
    loading = true
    let query = limitedQuery
    if (cadastros.length) {
      const last = cadastros[cadastros.length - 1]
      query = query.startAfter(last)
    }
    const docs = await query.get()
    hasMore = docs.size == 10
    cadastros = [...cadastros, ...docs.docs]
    loading = false
  }

  load()
</script>

<div class="container content box">
  <table class="table is-hoverable is-fullwidth">
    <thead>
      <tr>
        <th>Série</th>
        <th>Número</th>
        <th>Emissão</th>
        <th>Cliente</th>
        <th>Total</th>
        <th>Tipo</th>
      </tr>
    </thead>
    <tbody>
      {#each cadastros as cad}
        <tr>
          <td> {cad.get('infNFe.ide.serie')} </td>
          <td>
            <a href={$url('./nfe/:id', { id: cad.id })}>
              {cad.get('infNFe.ide.nNF')}
            </a>
          </td>
          <td> {cad.get('dhEmi').toDate().toLocaleString()} </td>
          <td> {cad.get('infNFe.dest.xNome')} </td>
          <td> {cad.get('infNFe.total.ICMSTot.vNF')} </td>
          <td> {cad.get('infNFe.ide.tpNF') == '0' ? 'Entrada' : 'Saída'} </td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="6">
          <div class="buttons is-centered">
            <button
              class="button"
              class:is-static={!hasMore}
              class:is-loading={loading}
            >
              Carregar mais
            </button>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</div>
