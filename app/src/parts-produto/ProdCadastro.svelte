<script lang="ts">
  import VeicProd from '../parts-produto/VeicProd.svelte'
  import Med from '../parts-produto/Med.svelte'
  import Arma from '../parts-produto/Arma.svelte'
  import Comb from '../parts-produto/Comb.svelte'
  import NRECOPI from '../parts-produto/NRECOPI.svelte'
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import { validaCNPJ } from '../code/validacaoDoc'
  import { pattern } from '../code/patterns'
  import unidades from '../code/nfe/unidades'

  export let prod: any

  if (!prod) prod = {
    cEAN: 'SEM GTIN',
    cEANTrib: 'SEM GTIN'
  }

  const detsComplexos = ['veicProd', 'med', 'arma', 'comb']
  const detsEspecificos = [...detsComplexos, 'nRECOPI']
  let detEspecifico = detsEspecificos.find((v) => prod[v]) ?? 'normal'

  $: {
    detsComplexos.forEach(v => {
      if (detEspecifico === v && !prod[v]) {
        prod[v] = v === 'nRECOPI' ? '' : {}
      } else if (detEspecifico !== v && prod[v]) {
        prod[v] = undefined
      }
    })
    
  }

  $: {
    if (!prod.CEST) {
      delete prod.indEscala
      delete prod.CNPJFab
    } else if (prod.indEscala == 'S') {
      delete prod.CNPJFab
    } else {
      prod.CNPJFab = ''
    }
  }
</script>

<label>
  Código
  <input maxlength="60" bind:value={prod['cProd']} required {pattern} />
</label>
<label>
  Descrição
  <input maxlength="120" bind:value={prod['xProd']} required {pattern} />
</label>
<label>
  Código NCM
  <input bind:value={prod['NCM']} pattern={'[0-9]{2}|[0-9]{8}'} required />
</label>
<label>
  CFOP padrão
  <input
    bind:value={prod['CFOP']}
    pattern={'[1,2,3,5,6,7]{1}[0-9]{3}'}
    required
  />
</label>
<label>
  GTIN
  <input
    bind:value={prod['cEAN']}
    pattern={'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}'}
    required
    title="Antigo código EAN ou código de barras, usar literal 'SEM GTIN' caso não haja"
  />
</label>
<label>
  Unidade comercial
  <select bind:value={prod['uCom']} required>
    {#each unidades as un}
      <option value={un.Unidade}>{un.Unidade} - {un.Descricao}</option>
    {/each}
    {#if prod['uCom'] && !unidades.some((v) => v.Unidade === prod['uCom'])}
      <option value={prod['uCom']}>Não padronizado: {prod['uCom']}</option>
    {/if}
  </select>
</label>
<label>
  Valor unitário de comercialização
  <input type="number" step="0.0001" bind:value={prod['vUnCom']} required />
</label>
<label>
  GTIN da unidade tributável
  <input
    bind:value={prod['cEANTrib']}
    pattern={'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}'}
    required
    title="Antigo código EAN ou código de barras, usar literal 'SEM GTIN' caso não haja"
  />
</label>
<label>
  Unidade tributável
  <select bind:value={prod['uTrib']} required>
    {#each unidades as un}
      <option value={un.Unidade}>{un.Unidade} - {un.Descricao}</option>
    {/each}
    {#if prod['uTrib'] && !unidades.some((v) => v.Unidade === prod['uTrib'])}
      <option value={prod['uTrib']}>Não padronizado: {prod['uTrib']}</option>
    {/if}
  </select>
</label>
<label>
  Valor unitário de tributação
  <input type="number" step="0.0001" bind:value={prod['vUnTrib']} required />
</label>
<label>
  <i>NVE</i>
  <input pattern={'[A-Z]{2}[0-9]{4}'} bind:value={prod['NVE']} />
</label>
<label>
  <i>CEST</i>
  <input type="number" min="1000000" max="9999999" bind:value={prod['CEST']} />
</label>
{#if prod['CEST']}
  <label>
    Produzido em escala relevante
    <select bind:value={prod.indEscala} required>
      <option value="S">Sim</option>
      <option value="N">Não</option>
    </select>
  </label>
  {#if prod.indEscala == 'N'}
    <label>
      CNPJ do Fabricante da Mercadoria
      <input
        required
        pattern={'[0-9]{14}'}
        bind:value={prod.CNPJFab}
        on:blur={() => validaCNPJ(prod.CNPJFab) || (prod.CNPJFab = '')}
        title="{aplicarMascara(prod.CNPJFab, 'cnpj')} - Obrigatório para produto em escala NÃO relevante"
      />
    </label>
  {/if}
{/if}
<label>
  <i>Código de benefício fiscal</i>
  <input
    pattern={'([!-ÿ]{8}|[!-ÿ]{10}|SEM CBENEF)?'}
    bind:value={prod['cBenef']}
    title="Se necessário, usar 'SEM CBENEF'"
  />
</label>
<label>
  <i>Código EX da TIPI</i>
  <input type="number" max="999" bind:value={prod['EXTIPI']} />
</label>
<label>
  Detalhamento específico
  <select bind:value={detEspecifico} required>
    <option value="normal">Produto comum</option>
    <option value="veicProd">Veículo</option>
    <option value="med">Medicamento</option>
    <option value="arma">Armamento</option>
    <option value="comb">Combustível</option>
    <option value="nRECOPI">Papel imune</option>
  </select>
</label>
{#if prod.veicProd}
  <VeicProd bind:veicProd={prod.veicProd} />
{:else if prod.med}
  <Med bind:med={prod.med} />
{:else if prod.arma}
  <Arma bind:arma={prod.arma} />
{:else if prod.comb}
  <Comb bind:raiz={prod} />
{:else if prod.nRECOPI !== undefined}
  <NRECOPI bind:nRECOPI={prod.nRECOPI} />
{/if}
<br />
