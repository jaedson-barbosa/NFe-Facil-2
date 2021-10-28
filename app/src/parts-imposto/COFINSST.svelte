<script lang="ts">
  import { getMoeda } from '../code/numero'

  export let raiz: any
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
<label>
  Valor do COFINSST compõe o valor total da nota
  <select bind:value={raiz.indSomaCOFINSST} required>
    <option value="0">Não</option>
    <option value="1">Sim</option>
  </select>
</label>

