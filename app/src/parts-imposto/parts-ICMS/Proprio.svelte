<script lang="ts">
  import { modBC } from '../../code/imposto/ICMS'
  import { getMoeda } from '../../code/numero'

  export let ICMS: any
  export let tipoICMS: string
  export let consumidorFinal: boolean
</script>

<h4>ICMS próprio</h4>
<label>
  Modalidade de determinação da BC
  <select bind:value={ICMS['modBC']} required={tipoICMS != '51'}>
    {#each modBC as e}
      <option value={e[0]}>{e[0]} - {e[1]}</option>
    {/each}
  </select>
</label>
{#if !['00', '10'].includes(tipoICMS)}
  <label>
    {#if tipoICMS == '20'}
      <i>Percentual de redução da BC</i>
    {:else}
      Percentual de redução da BC
    {/if}
    <input
      type="number"
      step="0.0001"
      bind:value={ICMS['pRedBC']}
      required={tipoICMS == '20'}
    />
  </label>
{/if}
{#if ICMS['vBC']}
  <p>
    <strong>Valor da BC do ICMS</strong>
    {getMoeda(ICMS['vBC'])}
    <br />
    <small>
      Aqui é usada a fórmula mais comum, valor do produto + frete + seguro +
      adicionais - desconto {#if consumidorFinal}+ ipi{/if}. Caso aplicável, o
      resultado deste somatório é multiplicado por 1 - redução / 100.
    </small>
  </p>
{/if}
{#if tipoICMS == '51'}
  <label>
    <i>Alíquota</i>
    <input type="number" step="0.0001" bind:value={ICMS['pICMS']} />
  </label>
  {#if ICMS['vICMSOp']}
    <p>
      <strong>Valor do ICMS da Operação:</strong>
      {getMoeda(ICMS['vICMSOp'])}
    </p>
  {/if}
  <label>
    <i>Percentual do diferemento</i>
    <input type="number" step="0.0001" bind:value={ICMS['pDif']} />
  </label>
  {#if ICMS['vICMSDif']}
    <p>
      <strong>Valor do ICMS diferido:</strong>
      {getMoeda(ICMS['vICMSDif'])}
    </p>
  {/if}
{:else}
  <label>
    Alíquota
    <input type="number" step="0.0001" bind:value={ICMS['pICMS']} required />
  </label>
{/if}
<p>
  <strong>Valor do ICMS</strong>
  {getMoeda(ICMS['vICMS'])}
</p>
<br />
