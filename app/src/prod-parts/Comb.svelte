<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Estado from '../components/Estado.svelte'
  import { calcularCIDE } from '../code/imposto/CIDE'
  import { onDestroy } from 'svelte'
  import { getMoeda } from '../code/numero'

  export let raiz: any
  if (!raiz.comb) raiz.comb = {}
  if (!raiz.comb.CIDE) raiz.comb.CIDE = {}
  if (!raiz.comb.encerrante) raiz.comb.encerrante = {}
  $: raiz = calcularCIDE(raiz)
  onDestroy(() => (raiz.comb = undefined))
</script>

<h3>Combustível</h3>
<InputT
  bind:val={raiz.comb.cProdANP}
  lab="Código de produto da ANP"
  pat={'[0-9]{9}'}
/>
<InputT
  bind:val={raiz.comb.descANP}
  lab="Descrição do Produto conforme ANP"
  aux="Utilizar a descrição de produtos do SIMP"
  min={2}
  max={95}
/>
{#if raiz.comb['cProdANP'] == 210203001}
  <InputT
    bind:val={raiz.comb.pGLP}
    opt
    lab="Percentual do GLP derivado do petróleo no produto GLP"
    aux="Valores de 0 a 100"
    pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
  />
  <InputT
    bind:val={raiz.comb.pGNn}
    opt
    lab="Percentual de gás natural nacional GLGNn para o produto GLP"
    aux="Valores de 0 a 100"
    pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
  />
  <InputT
    bind:val={raiz.comb.pGNi}
    opt
    lab="Percentual de gás natural importado GLGNi para o produto GLP"
    aux="Valores de 0 a 100"
    pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
  />
  <InputT
    bind:val={raiz.comb.vPart}
    opt
    lab="Valor de partida (por quilograma sem ICMS)"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
<InputT
  bind:val={raiz.comb.CODIF}
  opt
  lab="Código de autorização / registro do CODIF"
  aux="Informar quando a UF utilizar o CODIF"
  pat={'[0-9]{1,21}'}
/>
<!--
  Não acho que esse campo seja muito usado
<InputT
  bind:val={raiz.qTemp}
  opt
  lab="Quantidade de combustível faturada à temperatura ambiente"
  aux="Informar quando a quantidade tiver sido ajustada para uma temperatura diferente da ambiente"
  pat={'0.[1-9]{1}[0-9]{3}|0.[0-9]{3}[1-9]{1}|0.[0-9]{2}[1-9]{1}[0-9]{1}|0.[0-9]{1}[1-9]{1}[0-9]{2}|[1-9]{1}[0-9]{0,11}(.[0-9]{4})?'}
/>
-->
<Estado bind:UF={raiz.comb.UFCons} incluirEX lab="UF de consumo" />
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

<h4 class="opt">Encerrante</h4>
<InputT
  name="nBico"
  raiz={raiz.comb.encerrante}
  lab="Numero do bico utilizado no abastecimento"
  pat={'[0-9]{1,3}'}
/>
<InputT
  name="nTanque"
  raiz={raiz.comb.encerrante}
  lab="Numero de identificação do tanque"
  pat={'[0-9]{1,3}'}
/>
<InputT
  name="vEncIni"
  raiz={raiz.comb.encerrante}
  lab="Valor do Encerrante no ínicio do abastecimento"
  pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
/>
<InputT
  name="vEncFin"
  raiz={raiz.comb.encerrante}
  lab="Valor do Encerrante no final do abastecimento"
  pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
/>
<InputT
  name="nBomba"
  raiz={raiz.comb.encerrante}
  opt
  lab="Numero da bomba"
  pat={'[0-9]{1,3}'}
/>
