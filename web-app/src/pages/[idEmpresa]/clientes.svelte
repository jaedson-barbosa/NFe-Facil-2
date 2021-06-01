<script lang="ts">
  import { applyMask } from '@app/documentUtils'
  import { db } from '@app/firebase'
  import { url } from '@roxi/routify'

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
      .collection('clientes')
    const queryResult = await queryCol
      .where('dest.xNome', '>=', busca)
      .where(
        'dest.xNome',
        '<',
        busca.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
      )
      .limit(20)
      .get()
    cadastros = queryResult.docs.map((v) => {
      let doc = ''
      if (!doc) {
        const cpf = v.get('dest.CPF')
        if (cpf) doc = applyMask(cpf, 'cpf')
      }
      if (!doc) {
        const cnpj = v.get('dest.CNPJ')
        if (cnpj) doc = applyMask(cnpj, 'cnpj')
      }
      if (!doc) {
        const idEstrangeiro = v.get('dest.idEstrangeiro')
        if (idEstrangeiro) doc = idEstrangeiro
      }
      return { id: v.id, doc, nome: v.get('dest.xNome') }
    })
    loading = false
  }
</script>

<form on:submit|preventDefault={getCadastros}>
  <div class="field has-addons">
    <div class="control">
      <a class="button" href={$url('./cliente')}>
        <span class="icon is-small">
          <i class="fas fa-plus" />
        </span>
      </a>
    </div>
    <div class="control is-expanded">
      <input
        class="input"
        type="text"
        placeholder="Nome do cliente"
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
    <th>Documento</th>
    <th>Nome social</th>
    <th>Ações</th>
  </tr>
  {#each cadastros as cad}
    <tr>
      <td>{cad.doc}</td>
      <td>{cad.nome}</td>
      <td>
        <a href={$url('./cliente/:id', { id: cad.id })}> Editar </a>
      </td>
    </tr>
  {/each}
</table>
