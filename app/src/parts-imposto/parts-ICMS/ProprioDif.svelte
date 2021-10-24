<script lang="ts">
  import { modBC } from '../../code/imposto/ICMS'
  import { getMoeda } from '../../code/numero'

  export let ICMS: any

  let informar = !!ICMS['modBC']
  $: {
    if (!informar) {
      delete ICMS['modBC']
      delete ICMS['pRedBC']
      delete ICMS['pICMS']
      delete ICMS['pDif']
      ICMS = ICMS
    }
  }
</script>

<label>
  Informar campos de valores do ICMS próprio
  <select bind:value={informar}>
    <option value={false}>Não</option>
    <option value={true}>Sim</option>
  </select>
</label>
{#if informar}
  <h4>ICMS próprio</h4>
  <label>
    Modalidade de determinação da BC
    <select bind:value={ICMS['modBC']} required>
      {#each modBC as e}
        <option value={e[0]}>{e[0]} - {e[1]}</option>
      {/each}
    </select>
  </label>
  <label>
    <i>Percentual de redução da BC</i>
    <input type="number" step="0.0001" bind:value={ICMS['pRedBC']} />
  </label>
  {#if ICMS['vBC']}
    <p>
      <strong>Valor da BC do ICMS: </strong>
      {getMoeda(ICMS['vBC'])}
    </p>
  {/if}
  <label>
    Alíquota
    <input type="number" step="0.0001" bind:value={ICMS['pICMS']} required />
  </label>
  {#if ICMS['vICMSOp']}
    <p>
      <strong>Valor do ICMS da Operação:</strong>
      {getMoeda(ICMS['vICMSOp'])}
    </p>
  {/if}
  <label>
    Percentual do diferemento
    <input type="number" step="0.0001" bind:value={ICMS['pDif']} required />
  </label>
  {#if ICMS['vICMSDif']}
    <p>
      <strong>Valor do ICMS diferido:</strong>
      {getMoeda(ICMS['vICMSDif'])}
    </p>
  {/if}
  <p>
    <strong>Valor do ICMS</strong>
    {getMoeda(ICMS['vICMS'])}
  </p>
  <br />
{/if}
