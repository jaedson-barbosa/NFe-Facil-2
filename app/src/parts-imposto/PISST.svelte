<script lang="ts">
  import { calcular } from '../code/imposto/PISCOFINS'
  import { getMoeda } from '../code/numero'

  export let raiz: any
  export let prod: any

  $: raiz = calcular(prod, raiz, 'PIS')
</script>

<h3>PIS ST</h3>
{#if !raiz['vAliqProd']}
  <label>
    Alíquota em percentual
    <input type="number" step="0.0001" bind:value={raiz['pPIS']} required />
  </label>
{/if}
{#if !raiz['pPIS']}
  <label>
    Alíquota em reais
    <input type="number" step="0.0001" bind:value={raiz['vAliqProd']} required />
  </label>
{/if}
{#if raiz['vPIS']}
  <p>
    <strong>PIS ST calculado:</strong>
    {getMoeda(raiz['vPIS'])}
  </p>
{/if}
