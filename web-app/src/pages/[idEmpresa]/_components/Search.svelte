<script lang="ts" context="module">
  import type firebase from '@app/firebase'

  type TD = firebase.firestore.DocumentData
  export type TCadastro = firebase.firestore.QueryDocumentSnapshot<TD>
</script>

<script lang="ts">
  import { url } from '@roxi/routify'
  import type { TColumn } from '@app/store'
  import { userStatus } from '@app/store'

  export let coluna: TColumn
  export let placeholder: string
  export let addUrl: string
  export let editUrl: string
  export let wherePath: string
  export let headers: string[]
  export let itemRender: (v: TCadastro) => string[]

  let cadastros: TCadastro[] = []

  let lastBusca = ''
  let busca = ''
  let loading = false
  let hasMore = false

  async function load() {
    if (loading) return
    loading = true
    let query = coluna.limit(10).orderBy(wherePath, 'desc')
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

<div class="container">
  <form on:submit|preventDefault={load}>
    <div class="row">
      {#if $userStatus >= 3}
        <div class="column">
          <a class="button" href={$url(addUrl)}>Adicionar</a>
        </div>
      {/if}
      <div class="column">
        <input type="text" {placeholder} bind:value={busca} />
      </div>
      <div class="column">
        <button disabled={!busca} class:is-loading={loading}>
          Buscar
        </button>
      </div>
    </div>
  </form>

  <table>
    <thead>
      <tr>
        {#each headers as h}
          <th> {h} </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each cadastros as cad}
        <tr>
          {#each itemRender(cad) as i, index}
            <td>
              {#if index == 0}
                <a href={$url(editUrl, { id: cad.id })}> {i} </a>
              {:else}
                {i}
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
    {#if hasMore}
      <tfoot>
        <tr>
          <td colspan="6">
            <button class="button" disabled={loading} on:click={load}>
              Carregar mais
            </button>
          </td>
        </tr>
      </tfoot>
    {/if}
  </table>
</div>
