<script lang="ts">
  import { calcularCIDE } from '../code/imposto/CIDE'
  import { onDestroy } from 'svelte'
  import { getMoeda } from '../code/numero'
  import { EstadosEX } from '../code/IBGE'
  import ANP from '../code/ANP'
  import Encerrante from './Encerrante.svelte'
  import { pattern } from '../code/patterns'

  export let raiz: any
  if (!raiz.comb) raiz.comb = {}
  if (!raiz.comb.CIDE) raiz.comb.CIDE = {}
  if (!raiz.comb.encerrante) raiz.comb.encerrante = {}

  $: raiz = calcularCIDE(raiz)

  onDestroy(() => (raiz.comb = undefined))

  function escolher(v: typeof ANP[0]) {
    return () => {
      const comb = raiz.comb
      comb.cProdANP = v.codigo
      comb.descANP = v.produto
    }
  }

  let filtro = raiz.comb.cProdANP || ''
  $: anpFiltrado = filtro
    ? ANP.filter((v) => v.codigo.includes(filtro) || v.produto.includes(filtro))
    : ANP
</script>

<h3>Combustível</h3>
<label>
  Filtrar pelo código / descrição
  <input bind:value={filtro} />
</label>
<table>
  <thead>
    <tr>
      <th>Código</th>
      <th>Produto</th>
      <th>Unidade</th>
      <th>Família</th>
      <th>Grupo</th>
      <th>Sub-grupo</th>
      <th>Sub-subgrupo</th>
    </tr>
  </thead>
  <tbody style="height: 300px; overflow-y: scroll;">
    {#each anpFiltrado as v}
      <tr
        class="clicavel"
        class:marcado={raiz.comb.cProdANP == v.codigo}
        on:click={escolher(v)}
      >
        <td>{v.codigo}</td>
        <td>{v.produto}</td>
        <td>{v.unidadeSIMP}</td>
        <td>{v.familia}</td>
        <td>{v.grupo}</td>
        <td>{v.subgrupo}</td>
        <td>{v.subsubgrupo}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#if raiz.comb['cProdANP'] == 210203001}
  <label>
    <i>Percentual do GLP derivado do petróleo</i>
    <input type="number" step="0.0001" bind:value={raiz.comb.pGLP} />
  </label>
  <label>
    <i>Percentual de gás natural nacional GLGNn</i>
    <input type="number" step="0.0001" bind:value={raiz.comb.pGNn} />
  </label>
  <label>
    <i>Percentual de gás natural importado GLGNi</i>
    <input type="number" step="0.0001" bind:value={raiz.comb.pGNi} />
  </label>
  <label>
    Valor de partida (por quilograma sem ICMS)
    <input type="number" step="0.01" bind:value={raiz.comb.vPart} required />
  </label>
{/if}
<label>
  <i>Código de autorização / registro do CODIF</i>
  <input maxlength="21" bind:value={raiz.comb.CODIF} {pattern} />
</label>
<label>
  UF de consumo
  <select bind:value={raiz.comb.UFCons} required>
    {#each EstadosEX as uf}
      <option value={uf.Sigla}>{uf.Nome}</option>
    {/each}
  </select>
</label>
<label>
  <i>Alíquota do CIDE</i>
  {#if raiz.comb.CIDE.vCIDE}
    <small>
      Valor calculado:
      <i>{getMoeda(raiz.comb.CIDE.vCIDE)}</i>
    </small>
  {/if}
  <input type="number" step="0.0001" bind:value={raiz.comb.CIDE.vAliqProd} />
</label>
<Encerrante bind:encerrante={raiz.comb.encerrante} />
