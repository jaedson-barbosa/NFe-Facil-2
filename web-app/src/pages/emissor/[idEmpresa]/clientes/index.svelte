<script lang="ts">
  import { applyMask } from '@app/documentUtils'
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
      .collection('clientes')
    const end = busca.replace(/.$/, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 1)
    )
    const fieldPath = 'dest.xNome'
    const queryResult = await queryCol
      .where(fieldPath, '>=', busca)
      .where(fieldPath, '<', end)
      .limit(20)
      .get()
    cadastros = queryResult.docs.map((v) => {
      let doc = v.id
      if (doc.length == 14) doc = applyMask(doc, 'cnpj')
      if (doc.length == 11) doc = applyMask(doc, 'cpf')
      return {
        id: v.id,
        doc: v.get('dest.CPF') ?? v.get('dest.CNPJ') ?? v.get('dest.idEstrangeiro'),
        nome: v.get('dest.xNome')
      }
    })
    loading = false
  }
</script>

<form on:submit|preventDefault={getCadastros}>
  <div class="field has-addons">
    <div class="control">
      <a
        class="button"
        href={$url('../cadastro')}
      >
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
      <button
        class="button"
        disabled={!busca}
        class:is-loading={loading}
      >
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
      <a
        class="button"
        href={$url('../:id', { id: cad.id })}
      >
        <span class="icon is-small">
          <i class="fas fa-edit" />
        </span>
      </a>
    </td>
  </tr>
  {/each}
</table>
