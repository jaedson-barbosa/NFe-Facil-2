<script lang="ts">
  import { db } from '@app/firebase'
  import { url } from '@sveltech/routify'

  export let idEmpresa: string

  let busca = ''
  let loading = false
  let cadastros = []
  async function getCadastros() {
    loading = true
    const queryCol = db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('produtos')
    const queryResult = await queryCol
      .where('prod.xProd', '>=', busca)
      .where(
        'prod.xProd',
        '<',
        busca.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
      )
      .limit(20)
      .get()
    cadastros = queryResult.docs.map((v) => {
      return { id: v.id, cod: v.get('prod.cProd'), desc: v.get('prod.xProd') }
    })
    loading = false
  }
</script>

<form on:submit|preventDefault={getCadastros}>
  <div class="field has-addons">
    <div class="control">
      <a class="button" href={$url('../cadastro')}>
        <span class="icon is-small">
          <i class="fas fa-plus" />
        </span>
      </a>
    </div>
    <div class="control is-expanded">
      <input
        class="input"
        type="text"
        placeholder="Descrição do produto"
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
      <td>{cad.cod}</td>
      <td>{cad.desc}</td>
      <td>
        <a href={$url('../:id', { id: cad.id })}> Editar </a>
      </td>
    </tr>
  {/each}
</table>
