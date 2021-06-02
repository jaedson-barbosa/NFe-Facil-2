<script lang="ts" context="module">
  type TD = firebase.default.firestore.DocumentData
  export type TCadastro = firebase.default.firestore.QueryDocumentSnapshot<TD>
</script>

<script lang="ts">
  import { db } from '@app/firebase'
  import { url } from '@roxi/routify'

  export let idEmpresa: string
  export let coluna:
    | 'clientes'
    | 'transportes'
    | 'produtos'
    | 'notasSalvas'
    | 'notasEmitidas'
  export let placeholder: string
  export let editUrl: string
  export let wherePath: string
  export let headers: string[]
  export let itemRender: (v: TCadastro) => string[]

  let cadastros: TCadastro[] = []

  let lastBusca = ''
  let busca = ''
  let loading = false
  let hasMore = false
  const limitedQuery = db
    .collection('empresas')
    .doc(idEmpresa)
    .collection(coluna)
    .limit(10)

  async function load() {
    if (loading) return
    loading = true
    let query = limitedQuery
    if (busca != lastBusca) {
      cadastros = []
      const end = busca.replace(/.$/, (c) =>
        String.fromCharCode(c.charCodeAt(0) + 1)
      )
      query = query.where(wherePath, '>=', busca).where(wherePath, '<', end)
    } else if (cadastros.length) {
      const last = cadastros[cadastros.length - 1]
      query = query.startAfter(last)
    }
    const docs = await query.get()
    hasMore = docs.size == 10
    cadastros = [...cadastros, ...docs.docs]
    lastBusca = busca
    loading = false
  }

  load()
</script>

<div class="container content box">
  <form on:submit|preventDefault={load}>
    <div class="field has-addons">
      <div class="control">
        <a class="button" href={$url('./' + editUrl)}>
          <span class="icon is-small">
            <i class="fas fa-plus" />
          </span>
        </a>
      </div>
      <div class="control is-expanded">
        <input class="input" type="text" {placeholder} bind:value={busca} />
      </div>
      <div class="control">
        <button class="button" disabled={!busca} class:is-loading={loading}>
          Buscar
        </button>
      </div>
    </div>
  </form>

  <table class="table is-hoverable is-fullwidth">
    <thead>
      <tr>
        {#each headers as h}
          <th>h</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each cadastros as cad}
        <tr>
          {#each itemRender(cad) as i, index}
            {#if index == 0}
              <a href={$url(`./${editUrl}/:id`, { id: cad.id })}>
                {i}
              </a>
            {:else}
              <td>i</td>
            {/if}
          {/each}
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
              on:click={load}
            >
              Carregar mais
            </button>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</div>
