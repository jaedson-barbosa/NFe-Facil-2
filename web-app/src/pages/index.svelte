<!-- Seleção de emitente -->
<script lang="ts">
  import { db } from '@app/firebase'
  import { user } from '@app/store'
  import { url } from '@roxi/routify'
  import Empresa from './_components/Empresa.svelte'

  function getDescricaoStatus(status: 0 | 1 | 2 | 3) {
    switch (status) {
      case 0:
        return 'Em análise'
      case 1:
        return 'Rejeitado'
      case 2:
        return 'Habilitado'
      case 3:
        return 'Administrador'
    }
  }

  async function getCadastros() {
    const cadastros = await db
      .collectionGroup('usuarios')
      .where('id', '==', $user.uid)
      .get()
    return cadastros.docs.map((v) => {
      const parent = v.ref.parent.parent
      return {
        idEmpresa: parent.id,
        status: getDescricaoStatus(v.get('status')),
      }
    })
  }
</script>

<nav>
  <a class="button" href={$url('./precadastro')}>Cadastrar</a>
  <a class="button" href={$url('./requisicao')}>Requisitar acesso</a>
  <a class="button" href={$url('./acesso')}>Acessar com certificado</a>
  <button class="button" on:click={user.signOut}>Encerar sessão</button>
</nav>
{#await getCadastros() then cadastros}
  {#if cadastros.length}
    <table class="table is-hoverable is-fullwidth">
      <tr>
        <th>CNPJ</th>
        <th>Status</th>
      </tr>
      {#each cadastros as { idEmpresa, status }}
        <tr>
          <td>
            <a href={$url('./:idEmpresa', { idEmpresa })}> {idEmpresa} </a>
          </td>
          <td> {status} </td>
        </tr>
      {/each}
    </table>
  {/if}
{/await}
