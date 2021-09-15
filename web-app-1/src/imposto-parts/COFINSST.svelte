<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Opcional from '../components/Opcional.svelte'

  export let raiz: any
</script>

<Opcional {raiz} name="COFINSST" titulo="COFINS ST" let:r>
  <h4>COFINS ST</h4>
  {#if !r['qBCProd'] && !r['vAliqProd']}
    <InputT
      name="vBC"
      raiz={r}
      lab="Valor da BC do COFINS"
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
    <InputT
      name="pCOFINS"
      raiz={r}
      lab="Alíquota do COFINS (em percentual)"
      pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
  {/if}
  {#if !r['vBC'] && !r['pCOFINS']}
    <InputT
      name="qBCProd"
      raiz={r}
      lab="Quantidade Vendida"
      pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(.[0-9]{1,4})?'}
    />
    <InputT
      name="vAliqProd"
      raiz={r}
      lab="Alíquota do COFINS (em reais)"
      pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?'}
    />
  {/if}
  <InputT
    name="vCOFINS"
    raiz={r}
    lab="Valor do COFINS"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
</Opcional>
