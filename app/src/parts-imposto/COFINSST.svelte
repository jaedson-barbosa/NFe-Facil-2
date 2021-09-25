<script lang="ts">
  import { calcular } from '../code/imposto/PISCOFINS'
  import { getMoeda } from '../code/numero'

  export let raiz: any
  export let prod: any

  $: raiz = calcular(prod, raiz, 'COFINS')
</script>

<h3>COFINS ST</h3>
{#if !raiz['vAliqProd']}
  <label>
    Alíquota em percentual
    <input type="number" step="0.0001" bind:value={raiz['pCOFINS']} required />
  </label>
{/if}
{#if !raiz['pCOFINS']}
  <label>
    Alíquota em reais
    <input type="number" step="0.0001" bind:value={raiz['vAliqProd']} required />
  </label>
{/if}
{#if raiz['vCOFINS']}
  <p>
    <strong>COFINS ST calculado:</strong>
    {getMoeda(raiz['vCOFINS'])}
  </p>
{/if}
