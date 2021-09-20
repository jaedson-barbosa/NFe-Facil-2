<script lang="ts">
  import Doc from './Doc.svelte'

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

<h3>Autorizações de acesso ao XML</h3>
<button type="button" on:click={() => (autXML = [{}, ...autXML])}>
  Adicionar
</button>
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
