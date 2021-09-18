<script lang="ts">
  import Doc from './Doc.svelte'

  export let raiz: any

  if (!raiz['autXML']) raiz['autXML'] = []
  let autXML = raiz['autXML']
</script>

<h3>Autorizações de acesso ao XML</h3>
<button type="button" on:click={() => (autXML = [{}, ...autXML])}>
  Adicionar
</button>
<table>
  <thead>
    <tr>
      <th>Documento</th>
    </tr>
  </thead>
  <tbody>
    {#each autXML as v}
      <tr>
        <td>
          <Doc raiz={v} apenasBR />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
