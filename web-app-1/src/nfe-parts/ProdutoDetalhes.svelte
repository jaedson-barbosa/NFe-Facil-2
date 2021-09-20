<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Opcional from '../components/Opcional.svelte'
  import DI from '../prod-parts/DI.svelte'
  import DE from '../prod-parts/DE.svelte'
  import Rastro from '../prod-parts/Rastro.svelte'
  import VeicProd from '../prod-parts/VeicProd.svelte'
  import Med from '../prod-parts/Med.svelte'
  import Arma from '../prod-parts/Arma.svelte'
  import Comb from '../prod-parts/Comb.svelte'
  import NRECOPI from '../prod-parts/NRECOPI.svelte'

  export let raiz: any

  if (!raiz['prod']) raiz['prod'] = {}
  const prod = raiz['prod']

  if (!raiz.rastro) raiz.rastro = []

  $: impostoDevol = raiz['impostoDevol'] ?? {}
  $: impostoDevol && !impostoDevol.IPI && (impostoDevol.IPI = {})
</script>

<h3>Detalhes adicionais de {prod['xProd']}</h3>
<InputT
  bind:val={prod['nFCI']}
  opt
  lab="Número da FCI (Ficha de Conteúdo de Importação)"
  pat={'[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}'}
/>

<DI raiz={prod} />
<DE raiz={prod} />

<Opcional {raiz} name="impostoDevol" titulo="imposto devolvido">
  <h4>Imposto devolvido</h4>
  <InputT
    raiz={impostoDevol}
    name="pDevol"
    lab="Percentual de mercadoria devolvida"
    pat={'0(.[0-9]{2})?|100(.00)?|[1-9]{1}[0-9]{0,1}(.[0-9]{2})?'}
  />
  <InputT
    raiz={impostoDevol.IPI}
    name="vIPIDevol"
    lab="Valor do IPI devolvido"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
</Opcional>
<InputT
  bind:val={raiz['infAdProd']}
  opt
  lab="Informações adicionais do produto"
  aux="Norma referenciada, informações complementares, etc"
  min={1}
  max={500}
/>

{#if ['veicProd', 'med', 'arma', 'comb', 'nRECOPI'].some((v) => !!v[prod])}
  <h3>Detalhamento específico</h3>
  {#if prod['veicProd']}
    <VeicProd raiz={prod['veicProd']} />
  {/if}
  {#if prod['med']}
    <Med raiz={prod['med']} />
    <h4>Rastreabilidade</h4>
    <button type="button" on:click={() => (raiz.rastro = [{}, ...raiz.rastro])}>
      Adicionar
    </button>
    {#if raiz.rastro.length}
      <table>
        <thead>
          <tr>
            <th>Nº do lote</th>
            <th>Nº de produtos no lote</th>
            <th>Data de fabricação</th>
            <th>Data de validade</th>
            <th><i>Código de agregação</i></th>
          </tr>
        </thead>
        <tbody>
          {#each raiz.rastro as _, i}
            <Rastro raiz={raiz.rastro[i]} />
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
  {#if prod['arma']}
    <Arma raiz={prod['arma']} />
  {/if}
  {#if prod['comb']}
    <Comb raiz={prod['comb']} />
  {/if}
  {#if prod['nRECOPI']}
    <NRECOPI raiz={prod} />
  {/if}
{/if}
