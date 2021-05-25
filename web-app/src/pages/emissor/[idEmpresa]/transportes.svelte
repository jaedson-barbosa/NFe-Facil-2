<script lang="ts">
  import { db } from '@app/firebase'
  import { url } from '@sveltech/routify'

  export let scoped: {idEmpresa: string};
  $: ({ idEmpresa } = scoped)

  let busca = ''
  let loading = false
  let cadastros = []
  async function getCadastros() {
    loading = true
    const queryCol = db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('transportes')
    const queryResult = await queryCol
      .where('identificador', '>=', busca)
      .where(
        'identificador',
        '<',
        busca.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
      )
      .limit(20)
      .get()
    cadastros = queryResult.docs.map((v) => {
      return { id: v.id, identificador: v.get('identificador') }
    })
    loading = false
  }
</script>

<form on:submit|preventDefault={getCadastros}>
  <div class="field has-addons">
    <div class="control">
      <a class="button" href={$url('../transporte')}>
        <span class="icon is-small">
          <i class="fas fa-plus" />
        </span>
      </a>
    </div>
    <div class="control is-expanded">
      <input
        class="input"
        type="text"
        placeholder="Identificador"
        bind:value={busca}
      />
    </div>
    <div class="control">
      <button class="button" disabled={!busca} class:is-loading={loading}>
        Buscar
      </button>
    </div>
  </div>
</form>

<table class="table is-hoverable is-fullwidth">
  <tr>
    <th>Identificador</th>
    <th>Ações</th>
  </tr>
  {#each cadastros as cad}
    <tr>
      <td>{cad.identificador}</td>
      <td>
        <a href={$url('../transporte/:id', { id: cad.id })}> Editar </a>
      </td>
    </tr>
  {/each}
</table>
