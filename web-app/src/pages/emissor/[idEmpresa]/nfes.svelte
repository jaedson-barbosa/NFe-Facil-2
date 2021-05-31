<script lang="ts">
  import { db } from '@app/firebase'
  import { url } from '@roxi/routify'

  export let scoped: {idEmpresa: string};
  $: ({ idEmpresa } = scoped)

  let busca = ''
  let loading = false
  let cadastros = []
  // Implementar busca (mas dessa vez, bem feito, com filtro de status e tudo mais)
  async function getCadastros() {
    loading = true
    const queryResult = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('notasSalvas')
      .limit(10)
      .get()
    cadastros = queryResult.docs
    loading = false
  }
</script>

<form on:submit|preventDefault={getCadastros}>
  <div class="field has-addons">
    <div class="control">
      <a class="button" href={$url('./nfe')}>
        <span class="icon is-small">
          <i class="fas fa-plus" />
        </span>
      </a>
    </div>
    <div class="control is-expanded">
      <input
        class="input"
        type="text"
        placeholder="Qualquer coisa"
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
    <th>Código</th>
    <th>Descrição</th>
    <th>Ações</th>
  </tr>
  {#each cadastros as cad}
    <tr>
      <td>{cad.get('det.prod.cProd')}</td>
      <td>{cad.get('det.prod.xProd')}</td>
      <td>
        <a href={$url('./nfe/:id', { id: cad.id })}> Editar </a>
      </td>
    </tr>
  {/each}
</table>
