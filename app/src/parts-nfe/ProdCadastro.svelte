<script lang="ts">
  import VeicProd from '../parts-prod/VeicProd.svelte'
  import Med from '../parts-prod/Med.svelte'
  import Arma from '../parts-prod/Arma.svelte'
  import Comb from '../parts-prod/Comb.svelte'
  import NRECOPI from '../parts-prod/NRECOPI.svelte'
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import { validaCNPJ } from '../code/validacaoDoc'

  export let raiz: any

  if (!raiz['prod']) raiz['prod'] = {}
  let prod = raiz['prod']
  $: raiz.prod = prod
  $: !prod['CEST'] && (prod['indEscala'] = prod['CNPJFab'] = '')

  const detsComplexos = ['veicProd', 'med', 'arma', 'comb']
  const detsEspecificos = [...detsComplexos, 'nRECOPI']
  let detEspecifico = detsEspecificos.find((v) => prod[v]) ?? 'normal'

  if (prod.indTot === undefined) prod.indTot = '1'
  let indTot = prod.indTot == '1'
  $: prod.indTot = indTot ? '1' : '0'

  $: prod.CNPJFab = prod.indEscala == 'N' ? '' : undefined
</script>

<label>
  Código
  <input maxlength="60" bind:value={prod['cProd']} required />
</label>
<label>
  Descrição
  <input maxlength="120" bind:value={prod['xProd']} required />
</label>
<label>
  Código NCM
  <input bind:value={prod['NCM']} pattern={'[0-9]{2}|[0-9]{8}'} required />
</label>
<label>
  CFOP
  <input
    bind:value={prod['CFOP']}
    pattern={'[1,2,3,5,6,7]{1}[0-9]{3}'}
    required
  />
</label>
<label>
  GTIN
  <small>
    antigo código EAN ou código de barras, usar literal 'SEM GTIN' caso não haja
  </small>
  <input
    bind:value={prod['cEAN']}
    pattern={'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}'}
    required
  />
</label>
<label>
  Unidade comercial
  <input maxlength="6" bind:value={prod['uCom']} required />
</label>
<label>
  Valor unitário de comercialização
  <input type="number" step="0.0001" bind:value={prod['vUnCom']} required />
</label>
<label>
  GTIN da unidade tributável
  <small>
    antigo código EAN ou código de barras, usar literal 'SEM GTIN' caso não haja
  </small>
  <input
    bind:value={prod['cEANTrib']}
    pattern={'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}'}
    required
  />
</label>
<label>
  Unidade tributável
  <input maxlength="6" bind:value={prod['uTrib']} required />
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
      <small>
        {aplicarMascara(prod.CNPJFab, 'cnpj')} - obrigatório para produto em escala
        NÃO relevante
      </small>
      <input
        required
        pattern="[0-9]{14}"
        bind:value={prod.CNPJFab}
        on:blur={() => validaCNPJ(prod.CNPJFab) || (prod.CNPJFab = '')}
      />
    </label>
  {/if}
{/if}
<label>
  <i>Código de benefício fiscal</i>
  <small>
    Caso seja necessário preencher este campo e não haja um código, usar literal
    'SEM CBENEF'
  </small>
  <input
    pattern={'([!-ÿ]{8}|[!-ÿ]{10}|SEM CBENEF)?'}
    bind:value={prod['cBenef']}
  />
</label>
<label>
  <i>Código EX da TIPI</i>
  <input type="number" max="999" bind:value={prod['EXTIPI']} />
</label>
<label>
  <input type="checkbox" bind:checked={indTot} />
  O valor do item compõe o valor total da NF-e
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
{#if detEspecifico == 'veicProd'}
  <VeicProd bind:raiz={prod} />
{:else if detEspecifico == 'med'}
  <Med bind:raiz={prod} />
{:else if detEspecifico == 'arma'}
  <Arma bind:raiz={prod} />
{:else if detEspecifico == 'comb'}
  <Comb bind:raiz={prod} />
{:else if detEspecifico == 'nRECOPI'}
  <NRECOPI bind:raiz={prod} />
{/if}
<br />
