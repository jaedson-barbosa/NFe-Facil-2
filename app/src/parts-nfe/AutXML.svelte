<script lang="ts">
  import Adicionar from '../components/Adicionar.svelte'
  import Doc from '../components/Doc.svelte'

  export let raiz: any

  if (!raiz['autXML']) raiz['autXML'] = []
  let autXML: any[] = raiz['autXML']

  function removerItem(i: number) {
    return () => {
      autXML.splice(i, 1)
      autXML = autXML
    }
  }
</script>

<h2>
  Autorizações de acesso ao XML
  <Adicionar on:click={() => (autXML = [{}, ...autXML])} />
</h2>
<br />
{#if autXML.length}
  <table>
    <thead>
      <tr>
        <th>CPF/CNPJ</th>
      </tr>
    </thead>
    <tbody>
      {#each autXML as v, i}
        <tr>
          <td>
            <Doc raiz={v} on:invalido={removerItem(i)} apenasBR simplificado />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
