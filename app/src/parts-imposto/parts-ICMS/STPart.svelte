<script lang="ts">
  import { EstadosEX } from '../../code/IBGE'

  export let ICMS: any
</script>

<label>
  Percentual da BC da operação própria
  <input type="number" step="0.0001" bind:value={ICMS['pBCOp']} required />
</label>
<label>
  UF para qual é devido o ICMS ST
  <select bind:value={ICMS.UFST} required>
    {#each EstadosEX as uf}
      <option value={uf.Sigla}>{uf.Nome}</option>
    {/each}
  </select>
</label>
