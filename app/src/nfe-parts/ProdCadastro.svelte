<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Opcional from '../components/Opcional.svelte'
  import VeicProd from '../prod-parts/VeicProd.svelte'
  import Med from '../prod-parts/Med.svelte'
  import Arma from '../prod-parts/Arma.svelte'
  import Comb from '../prod-parts/Comb.svelte'
  import NRECOPI from '../prod-parts/NRECOPI.svelte'

  export let raiz: any

  if (!raiz['prod']) raiz['prod'] = {}
  let prod = raiz['prod']

  $: !prod['CEST'] && (prod['indEscala'] = prod['CNPJFab'] = '')
</script>

<h3>Dados do produto</h3>
<InputT bind:val={prod['cProd']} lab="Código do produto" min={1} max={60} />
<InputT bind:val={prod['xProd']} lab="Descrição" min={1} max={120} />
<InputT bind:val={prod['NCM']} lab="Código NCM" pat={'[0-9]{2}|[0-9]{8}'} />
<InputT bind:val={prod['CFOP']} lab="CFOP" pat={'[1,2,3,5,6,7]{1}[0-9]{3}'} />
<InputT
  bind:val={prod['cEAN']}
  lab="GTIN do produto"
  aux="antigo código EAN ou código de barras"
  pat={'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}'}
/>
<InputT bind:val={prod['uCom']} lab="Unidade comercial" min={1} max={6} />
<InputT
  bind:val={prod['vUnCom']}
  lab="Valor unitário de comercialização"
  pat={'0|0.[0-9]{1,10}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,10})?'}
/>
<InputT
  bind:val={prod['cEANTrib']}
  lab="GTIN da unidade tributável"
  aux="antigo código EAN ou código de barras"
  pat={'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}'}
/>
<InputT bind:val={prod['uTrib']} lab="Unidade Tributável" min={1} max={6} />
<InputT
  bind:val={prod['vUnTrib']}
  lab="Valor unitário de tributação"
  pat={'0.[0-9]{1,10}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,10})?'}
/>
<InputT bind:val={prod['NVE']} opt lab="NVE" pat={'[A-Z]{2}[0-9]{4}'} />
<InputT bind:val={prod['CEST']} opt lab="CEST" pat={'[0-9]{7}'} />
{#if prod['CEST']}
  <Select
    bind:val={prod['indEscala']}
    opt
    lab="Escala relevante"
    els={[
      ['S', 'Sim'],
      ['N', 'Não'],
    ]}
  />
  <InputT
    bind:val={prod['CNPJFab']}
    opt
    lab="CNPJ do Fabricante da Mercadoria, obrigatório para produto em escala NÃO relevante."
    pat={'[0-9]{14}'}
    max={14}
    mask="cnpj"
  />
{/if}
<InputT
  bind:val={prod['cBenef']}
  opt
  lab="Código de benefício fiscal"
  pat={'([!-ÿ]{8}|[!-ÿ]{10}|SEM CBENEF)?'}
/>
<InputT bind:val={prod['EXTIPI']} opt lab="EX TIPI" pat={'[0-9]{2,3}'} />
<Select
  bind:val={prod['indTot']}
  lab="O valor do item compõe o valor total da NF-e"
  els={[
    ['1', 'Sim'],
    ['0', 'Não'],
  ]}
/>

<h3>Detalhamento específico</h3>
{#if !raiz['med'] && !raiz['arma'] && !raiz['comb'] && !raiz['nRECOPI']}
  <Opcional {raiz} name="veicProd" titulo="veículo novo" let:r>
    <VeicProd raiz={r} />
  </Opcional>
{/if}
{#if !raiz['veicProd'] && !raiz['arma'] && !raiz['comb'] && !raiz['nRECOPI']}
  <Opcional {raiz} name="med" titulo="medicamento" let:r>
    <Med raiz={r} />
  </Opcional>
{/if}
{#if !raiz['veicProd'] && !raiz['med'] && !raiz['comb'] && !raiz['nRECOPI']}
  <Opcional {raiz} name="arma" titulo="armamento" let:r>
    <Arma raiz={r} />
  </Opcional>
{/if}
{#if !raiz['veicProd'] && !raiz['med'] && !raiz['arma'] && !raiz['nRECOPI']}
  <Opcional {raiz} name="comb" titulo="combustível">
    <Comb bind:raiz />
  </Opcional>
{/if}
{#if !raiz['veicProd'] && !raiz['med'] && !raiz['arma'] && !raiz['comb']}
  <NRECOPI raiz={prod} />
{/if}
