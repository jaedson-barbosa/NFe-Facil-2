<script lang="ts">
  import DE from '../parts-produto/DE.svelte'
  import Rastro from '../parts-produto/Rastro.svelte'
  import VeicProd from '../parts-produto/VeicProd.svelte'
  import Med from '../parts-produto/Med.svelte'
  import Arma from '../parts-produto/Arma.svelte'
  import Comb from '../parts-produto/Comb.svelte'
  import NRECOPI from '../parts-produto/NRECOPI.svelte'
  import Adicionar from '../components/Adicionar.svelte'
  import { goto, url } from '@roxi/routify'

  export let raiz: any

  if (!raiz['prod']) raiz['prod'] = {}
  let prod = raiz.prod
  $: raiz.prod = prod

  if (!prod.rastro) prod.rastro = []
  if (!prod.DI) prod.DI = []
  if (!raiz.impostoDevol.IPI) raiz.impostoDevol.IPI = {}

  let pDevol = raiz.impostoDevol?.pDevol ?? 0
  $: raiz.impostoDevol = pDevol ? { pDevol, IPI: {} } : undefined
</script>

<h2>Detalhes adicionais de {prod['xProd']}</h2>
<label>
  <i>Número da FCI (Ficha de Conteúdo de Importação)</i>
  <input
    pattern={'[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}'}
    bind:value={prod['nFCI']}
  />
</label>

<h3>Declaração de Importação</h3>
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

<h3>Imposto devolvido</h3>
<label>
  <i>Percentual de mercadoria devolvida</i>
  <input type="number" step="0.01" bind:value={pDevol} />
</label>
{#if raiz.impostoDevol?.IPI}
  <label>
    Valor do IPI devolvido
    <input
      type="number"
      step="0.01"
      bind:value={raiz.impostoDevol.IPI.vIPIDevol}
      required
    />
  </label>
{/if}

<label>
  <i>Informações adicionais do produto</i>
  <small>Norma referenciada, informações complementares, etc</small>
  <input maxlength="500" bind:value={raiz['infAdProd']} />
</label>

{#if ['veicProd', 'med', 'arma', 'comb', 'nRECOPI'].some((v) => !!v[prod])}
  <h2>Detalhamento específico</h2>
  {#if prod['veicProd']}
    <VeicProd bind:raiz={prod['veicProd']} />
  {/if}
  {#if prod['med']}
    <Med bind:raiz={prod['med']} />
    <h3>
      Rastreabilidade
      <Adicionar on:click={() => (prod.rastro = [{}, ...prod.rastro])} />
    </h3>
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
    <Comb bind:raiz={prod} />
  {/if}
  {#if prod['nRECOPI']}
    <NRECOPI bind:raiz={prod} />
  {/if}
{/if}
