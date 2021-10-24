<script lang="ts">
  import { calcularCIDE } from '../code/imposto/CIDE'
  import { getMoeda } from '../code/numero'
  import { EstadosEX } from '../code/IBGE'
  import {
    familias,
    buscarFamilia,
    buscarGrupo,
    buscarSubsubgrupo,
    buscarProduto,
  } from '../code/ANP'
  import Encerrante from './Encerrante.svelte'
  import { pattern } from '../code/patterns'

  export let raiz: any

  if (!raiz.comb.CIDE) raiz.comb.CIDE = {}
  if (!raiz.comb.encerrante) raiz.comb.encerrante = {}

  $: raiz = calcularCIDE(raiz)

  let cProdANP = raiz.comb.cProdANP
  let familia = buscarFamilia(cProdANP)
  let grupo = buscarGrupo(familia, cProdANP)
  let subsubgrupo = buscarSubsubgrupo(grupo, cProdANP)
  let produto = buscarProduto(subsubgrupo, cProdANP)
  $: {
    if (produto) {
      const comb = raiz.comb
      comb.cProdANP = produto.codigo
      comb.descANP = produto.produto
    }
  }
</script>

<h3>Combustível</h3>
<label>
  Família
  <select bind:value={familia} required>
    {#each familias as familia}
      <option value={familia}>{familia.familia}</option>
    {/each}
  </select>
</label>
{#if familia}
  <label>
    Grupo
    <select bind:value={grupo} required>
      {#each familia.grupos as grupo}
        <option value={grupo}>{grupo.grupo} - {grupo.subgrupo}</option>
      {/each}
    </select>
  </label>
{/if}
{#if grupo}
  <label>
    Subgrupo
    <select bind:value={subsubgrupo} required>
      {#each grupo.subsubgrupos as subsubgrupo}
        <option value={subsubgrupo}>{subsubgrupo.subsubgrupo}</option>
      {/each}
    </select>
  </label>
{/if}
{#if subsubgrupo}
  <label>
    Produto
    <select bind:value={produto} required>
      {#each subsubgrupo.produtos as produto}
        <option value={produto}>{produto.codigo} - {produto.produto}</option>
      {/each}
    </select>
  </label>
{/if}

{#if raiz.comb['cProdANP'] == '210203001'}
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
