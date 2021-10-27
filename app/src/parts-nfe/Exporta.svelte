<script lang="ts">
  import { Estados } from '../code/IBGE'

  export let exporta: any

  let informar = !!exporta
  $: {
    if (informar && !exporta) exporta = {}
    if (!informar && exporta) exporta = undefined
  }
</script>

<h2>Exportação</h2>
<div class="row">
  <label>
    Estado de saída
    <select bind:value={exporta.UFSaidaPais} required>
      {#each Estados as uf}
        <option value={uf}>{uf.Nome}</option>
      {/each}
    </select>
  </label>
</div>
