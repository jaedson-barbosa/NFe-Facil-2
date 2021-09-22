<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import DE from '../prod-parts/DE.svelte'
  import Rastro from '../prod-parts/Rastro.svelte'
  import VeicProd from '../prod-parts/VeicProd.svelte'
  import Med from '../prod-parts/Med.svelte'
  import Arma from '../prod-parts/Arma.svelte'
  import Comb from '../prod-parts/Comb.svelte'
  import NRECOPI from '../prod-parts/NRECOPI.svelte'
  import { goto, url } from '@roxi/routify'

  export let raiz: any

  if (!raiz['prod']) raiz['prod'] = {}
  let prod = raiz.prod
  $: raiz.prod = prod

  if (!prod.rastro) prod.rastro = []
  if (!prod.DI) prod.DI = []
  if (!prod.impostoDevol) prod.impostoDevol = {}
  if (!prod.impostoDevol.IPI) prod.impostoDevol.IPI = {}
</script>

<h3>Detalhes adicionais de {prod['xProd']}</h3>
<InputT
  bind:val={prod['nFCI']}
  opt
  lab="Número da FCI (Ficha de Conteúdo de Importação)"
  pat={'[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}'}
/>

<h4>Declaração de Importação</h4>
<a class="button" href={$url('./:di', { di: '-1' })}>Adicionar</a>
<br />
{#if prod.DI.length}
  <table>
    <thead>
      <tr>
        <th>Nº do Documento de Importação</th>
      </tr>
    </thead>
    <tbody>
      {#each prod.DI as _, i}
        <tr on:click={$goto('./:di', { di: i })}>
          <td>{prod.DI[i].nDI}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<br />

<DE bind:raiz={prod} />

<h4>Imposto devolvido</h4>
<InputT
  bind:val={raiz.impostoDevol.pDevol}
  opt={!raiz.impostoDevol.IPI.vIPIDevol}
  lab="Percentual de mercadoria devolvida"
  pat={'0(.[0-9]{2})?|100(.00)?|[1-9]{1}[0-9]{0,1}(.[0-9]{2})?'}
/>
<InputT
  bind:val={raiz.impostoDevol.IPI.vIPIDevol}
  opt={!raiz.impostoDevol.pDevol}
  lab="Valor do IPI devolvido"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>

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
    <VeicProd bind:raiz={prod['veicProd']} />
  {/if}
  {#if prod['med']}
    <Med bind:raiz={prod['med']} />
    <h4>Rastreabilidade</h4>
    <button type="button" on:click={() => (prod.rastro = [{}, ...prod.rastro])}>
      Adicionar
    </button>
    {#if prod.rastro.length}
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
          {#each prod.rastro as _, i}
            <Rastro bind:raiz={prod.rastro[i]} />
          {/each}
        </tbody>
      </table>
    {/if}
  {/if}
  {#if prod['arma']}
    <Arma bind:raiz={prod['arma']} />
  {/if}
  {#if prod['comb']}
    <Comb bind:raiz={prod['comb']} />
  {/if}
  {#if prod['nRECOPI']}
    <NRECOPI bind:raiz={prod} />
  {/if}
{/if}
