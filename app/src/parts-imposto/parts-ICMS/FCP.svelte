<script lang="ts">
  import { getMoeda } from '../../code/numero'

  export let ICMS: any
  export let dif: boolean
</script>

<h4>Fundo de Combate à Pobreza</h4>
{#if ICMS['vBCFCP']}
  <p>
    <strong>Base de cálculo:</strong>
    {getMoeda(ICMS['vBCFCP'])}
  </p>
{/if}
<label>
  Percentual
  <input type="number" step="0.0001" bind:value={ICMS['pFCP']} />
</label>
{#if dif}
  <label>
    Percentual do diferemento
    <input type="number" step="0.0001" bind:value={ICMS['pFCPDif']} />
  </label>
{/if}
{#if ICMS['vFCP']}
  <p>
    <strong>Valor:</strong>
    {getMoeda(ICMS['vFCP'])}
  </p>
{/if}
<br />