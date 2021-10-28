<script lang="ts">
  import { getMoeda } from '../code/numero'

  export let raiz: any
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
    <input
      type="number"
      step="0.0001"
      bind:value={raiz['vAliqProd']}
      required
    />
  </label>
{/if}
{#if raiz['vPIS']}
  <p>
    <strong>PIS ST calculado:</strong>
    {getMoeda(raiz['vPIS'])}
  </p>
{/if}
<label>
  Valor do PISST compõe o valor total da nota
  <select bind:value={raiz.indSomaPISST} required>
    <option value="0">Não</option>
    <option value="1">Sim</option>
  </select>
</label>
