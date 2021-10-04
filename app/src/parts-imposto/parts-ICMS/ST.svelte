<script lang="ts">
  import { modBCST } from '../../code/imposto/ICMS'
  import { getMoeda } from '../../code/numero'

  export let ICMS: any
</script>

<h4>ICMS - Substituição tributária</h4>
<label>
  Modalidade de determinação da BC do ICMS ST
  <select bind:value={ICMS['modBCST']} required>
    {#each modBCST as e}
      <option value={e[0]}>{e[0]} - {e[1]}</option>
    {/each}
  </select>
</label>
<label>
  <i>Percentual MVA ST</i>
  <input type="number" step="0.0001" bind:value={ICMS['pMVAST']} />
</label>
<label>
  <i>Percentual de redução da BC ST</i>
  <input type="number" step="0.0001" bind:value={ICMS['pRedBCST']} />
</label>
{#if ICMS['vBCST']}
  <p>
    <strong>Base de cálculo do ST:</strong>
    {getMoeda(ICMS['vBCST'])}
  </p>
{/if}
<label>
  Alíquota do ST
  <input type="number" step="0.0001" bind:value={ICMS['pICMSST']} required />
</label>
{#if ICMS['vICMSST']}
  <p>
    <strong>Valor do ST:</strong>
    {getMoeda(ICMS['vICMSST'])}
  </p>
{/if}
