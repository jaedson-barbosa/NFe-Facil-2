<script lang="ts">
  import { getMoeda } from '../../code/numero'

  export let ICMS: any
</script>

<h4>FCP - Substituição Tributária</h4>
{#if ICMS['vBCFCPST']}
  <p>
    <strong>Base de cálculo:</strong>
    {getMoeda(ICMS['vBCFCPST'])}
  </p>
{/if}
<label>
  <i>Percentual do FCP ST</i>
  <input type="number" step="0.0001" bind:value={ICMS['pFCPST']} />
</label>
{#if ICMS['vFCPST']}
  <p>
    <strong>Valor:</strong>
    {getMoeda(ICMS['vFCPST'])}
  </p>
{/if}
<br />