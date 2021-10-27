<script lang="ts">
  import { Estados } from '../code/IBGE'
  import { pattern } from '../code/patterns'

  export let exporta: any
</script>

<h2>Exportação</h2>
<div class="row">
  <div class="column">
    <label>
      Estado de saída
      <select bind:value={exporta.UFSaidaPais} required>
        {#each Estados as uf}
          <option value={uf}>{uf.Nome}</option>
        {/each}
      </select>
    </label>
  </div>
  <div class="column">
    <label>
      <i>Descrição do recinto alfandegado</i>
      <input bind:value={exporta.xLocDespacho} {pattern} maxlength="60" />
    </label>
  </div>
</div>
<label>
  Descrição do local de embarque/transposição de fronteira
  <input bind:value={exporta.xLocExporta} maxlength="60" {pattern} required />
</label>
<br />
