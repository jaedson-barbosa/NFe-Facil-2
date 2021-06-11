<!-- Seleção de emitente -->
<script lang="ts">
  import firebase from '@app/firebase'
  import { user } from '@app/store'
  import { url } from '@roxi/routify'

  function getDescricaoStatus(status: 0 | 1 | 2 | 3 | 4) {
    switch (status) {
      case 0:
        return 'Em análise'
      case 1:
        return 'Rejeitado'
      case 2:
        return 'Apenas leitura'
      case 3:
        return 'Leitura e escrita'
      case 4:
        return 'Administrador'
    }
  }

  async function getCadastros() {
    const db = firebase.firestore()
    const cadastros = await db
      .collectionGroup('usuarios')
      .where('id', '==', $user.uid)
      .get()
    return cadastros.docs.map((v) => {
      const parent = v.ref.parent.parent
      return {
        idEmpresa: parent.id,
        status: v.get('status'),
      }
    })
  }
</script>

{#await getCadastros() then cadastros}
  <nav>
    <a class="button" href={$url('./precadastro')}>Cadastrar</a>
    <a class="button" href={$url('./requisicao')}>Requisitar acesso</a>
    <button class="button" on:click={user.signOut}>Encerar sessão</button>
  </nav>
  {#if cadastros.length}
    <table class="table is-hoverable is-fullwidth">
      <tr>
        <th>CNPJ</th>
        <th>Status</th>
      </tr>
      {#each cadastros as { idEmpresa, status }}
        <tr>
          <td>
            {#if status >= 2}
              <a href={$url('./:idEmpresa', { idEmpresa })}> {idEmpresa} </a>
            {:else}
              {idEmpresa}
            {/if}
          </td>
          <td> {getDescricaoStatus(status)} </td>
        </tr>
      {/each}
    </table>
  {/if}
{/await}
