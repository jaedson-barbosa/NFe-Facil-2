<script lang="ts">
  import { modBC } from '../../code/imposto/ICMS'
  import { getMoeda } from '../../code/numero'

  export let ICMS: any
  export let incluirRedBC: boolean
  export let obrigatorioRedBC: boolean
</script>

<h4>ICMS próprio</h4>
<label>
  Modalidade de determinação da BC
  <select bind:value={ICMS['modBC']} required>
    {#each modBC as e}
      <option value={e[0]}>{e[0]} - {e[1]}</option>
    {/each}
  </select>
</label>
{#if incluirRedBC}
  <label>
    {#if obrigatorioRedBC}
      Percentual de redução da BC
    {:else}
      <i>Percentual de redução da BC</i>
    {/if}
    <input
      type="number"
      step="0.0001"
      bind:value={ICMS['pRedBC']}
      required={obrigatorioRedBC}
    />
  </label>
{/if}
{#if ICMS['vBC']}
  <p>
    <strong>Valor da BC do ICMS</strong>
    {getMoeda(ICMS['vBC'])}
  </p>
{/if}
<label>
  Alíquota
  <input type="number" step="0.0001" bind:value={ICMS['pICMS']}  required />
</label>
<p>
  <strong>Valor do ICMS</strong>
  {getMoeda(ICMS['vICMS'])}
</p>
<br />
