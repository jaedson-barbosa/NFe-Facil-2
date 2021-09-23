<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Opcional from '../components/Opcional.svelte'
  import Estado from '../components/Estado.svelte'
  import { calcularCIDE } from '../code/imposto/CIDE'

  export let raiz: any
  let comb = raiz.comb
  $: raiz.comb = comb = calcularCIDE(raiz)
</script>

<h4>Combustível</h4>
<InputT
  bind:val={comb.cProdANP}
  lab="Código de produto da ANP"
  pat={'[0-9]{9}'}
/>
<InputT
  bind:val={comb.descANP}
  lab="Descrição do Produto conforme ANP"
  aux="Utilizar a descrição de produtos do SIMP"
  min={2}
  max={95}
/>
{#if comb['cProdANP'] == 210203001}
  <InputT
    bind:val={comb.pGLP}
    opt
    lab="Percentual do GLP derivado do petróleo no produto GLP"
    aux="Valores de 0 a 100"
    pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
  />
  <InputT
    bind:val={comb.pGNn}
    opt
    lab="Percentual de gás natural nacional GLGNn para o produto GLP"
    aux="Valores de 0 a 100"
    pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
  />
  <InputT
    bind:val={comb.pGNi}
    opt
    lab="Percentual de gás natural importado GLGNi para o produto GLP"
    aux="Valores de 0 a 100"
    pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
  />
  <InputT
    bind:val={comb.vPart}
    opt
    lab="Valor de partida (por quilograma sem ICMS)"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
<InputT
  bind:val={comb.CODIF}
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
<Estado bind:UF={comb.UFCons} incluirEX lab="UF de consumo" />

<Opcional raiz={comb} name="CIDE" titulo="CIDE" let:r={CIDE}>
  <h5>Contribuição de Intervenção no Domínio Econômico</h5>
  <InputT
    raiz={CIDE}
    name="qBCProd"
    lab="BC do CIDE ( Quantidade comercializada)"
    pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(.[0-9]{1,4})?'}
  />
  <InputT
    name="vAliqProd"
    raiz={CIDE}
    lab="Alíquota do CIDE  (em reais)"
    pat={'0|0.[0-9]{4}|[1-9]{1}[0-9]{0,10}(.[0-9]{4})?'}
  />
  <InputT
    name="vCIDE"
    raiz={CIDE}
    lab="Valor do CIDE"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
</Opcional>
<Opcional raiz={comb} name="encerrante" titulo="encerrante" let:r={encerrante}>
  <h5>Encerrante</h5>
  <InputT
    name="nBico"
    raiz={encerrante}
    lab="Numero do bico utilizado no abastecimento"
    pat={'[0-9]{1,3}'}
  />
  <InputT
    name="nTanque"
    raiz={encerrante}
    lab="Numero de identificação do tanque"
    pat={'[0-9]{1,3}'}
  />
  <InputT
    name="vEncIni"
    raiz={encerrante}
    lab="Valor do Encerrante no ínicio do abastecimento"
    pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
  />
  <InputT
    name="vEncFin"
    raiz={encerrante}
    lab="Valor do Encerrante no final do abastecimento"
    pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
  />
  <InputT
    name="nBomba"
    raiz={encerrante}
    opt
    lab="Numero da bomba"
    pat={'[0-9]{1,3}'}
  />
</Opcional>
