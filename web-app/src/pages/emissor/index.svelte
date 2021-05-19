<!-- Seleção de emitente -->
<script lang="ts">
  import { db } from '@app/firebase'
  import { user } from '@app/store'
  import Empresa from './_components/Empresa.svelte'

  function getDescricaoStatus(status: 0 | 1 | 2 | 3) {
    switch (status) {
      case 0: return 'Em análise'
      case 1: return 'Rejeitado'
      case 2: return 'Habilitado'
      case 3: return 'Administrador'
    }
  }

  async function getCadastros() {
    const cadastros = await db
      .collectionGroup('usuarios')
      .where('id', '==', $user.uid)
      .get()
    return cadastros.docs.map((v) => {
      const parent = v.ref.parent.parent
      const manager = {
        parentId: parent.id,
        status: getDescricaoStatus(v.get('status')),
        loadParentName: async () => {
          const k = await parent.get()
          // await new Promise(res => setTimeout(res, 5000))
          return k.get('emit.xNome') as string
        }
      }
      return manager
    })
  }
</script>

{#await getCadastros() then cadastros}
  {#if cadastros.length}
    <table class="table is-hoverable is-fullwidth">
      <tr>
        <th>CNPJ</th>
        <th>Status</th>
        <th>Nome social</th>
        <th>Ações</th>
      </tr>
      {#each cadastros as cad}
        <Empresa {cad} />
      {/each}
    </table>
  {/if}
{/await}
