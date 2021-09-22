<script lang="ts">
  import { calcular } from '../code/imposto/PISCOFINS';
  import { getMoeda } from '../code/numero'
  import InputT from '../components/InputT.svelte'

  export let raiz: any
  export let prod: any

  $: raiz = calcular(prod, raiz, 'COFINS')
</script>

<h4>COFINS ST</h4>
{#if !raiz['vAliqProd']}
  <p>A base de cálculo considerada é o valor total bruto do produto.</p>
  <InputT
    bind:val={raiz['pCOFINS']}
    lab="Alíquota do COFINS (em percentual)"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
{/if}
{#if !raiz['pCOFINS']}
  <p>A quantidade considerada é a quantidade tributável.</p>
  <InputT
    bind:val={raiz['vAliqProd']}
    lab="Alíquota do COFINS (em reais)"
    pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?'}
  />
{/if}
{#if raiz['vCOFINS']}
  <strong>COFINS ST calculado:</strong>
  {getMoeda(raiz['vCOFINS'])}
{/if}
