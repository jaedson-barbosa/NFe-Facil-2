<!-- Seleção de emitente -->
<script lang="ts">
  import { db, FieldPath } from '@app/firebase';
  import { user } from '@app/store'
  import { url } from '@sveltech/routify'

  function getDescricaoStatus(status: 0 | 1 | 2 | 3) {
    switch (status) {
      case 0:
        return 'Aguardando liberação pela administração.'
      case 1:
        return 'Acesso bloqueado pela administração'
      case 2:
        return 'Acesso liberado como usuário comum'
      case 3:
        return 'Acesso liberado como administrador'
    }
  }

  async function getCadastros() {
    const cadastros = await db
      .collectionGroup('usuarios')
      .where('id', '==', $user.uid)
      .get()
    return cadastros.docs.map(v => {
      const manager = {
        parentId: v.ref.parent.parent.id,
        status: getDescricaoStatus(v.get('status')),
        parent: undefined,
        loading: false
      }
      return manager
    })
  }
</script>

{#await getCadastros() then cadastros}
{#if cadastros.length}
<div class="table-container">
  <table class:table={true} >
    <tr>
      <th>CNPJ</th>
      <th>Nome social</th>
      <th>Nome fantasia</th>
      <th>Status</th>
    </tr>
    {#each cadastros as cad}
    <tr>
      <td>{cad.parentId}</td>
      {#if cad.parent}
      <td>Nome social</td>
      <td>Nome fantasia</td>
      {:else}
      <td colspan="2">
        <button
          class="button is-small"
          class:is-loading={cad.loading}
        >
          Salvar
        </button>
      </td>
      {/if}
      <td>{cad.status}</td>
    </tr>
    {/each}
  </table>
</div>
{/if}
{/await}