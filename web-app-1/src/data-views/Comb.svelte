<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Opcional from "../components/Opcional.svelte";
  import Estado from "../components/Estado.svelte";
  import Cide from "./CIDE.svelte";
  import Encerrante from "./Encerrante.svelte";

  export let raiz: any;

  const el = "comb";
  if (!raiz[el]) raiz[el] = {};
  $: r = raiz[el];
</script>

<h5>Combustível</h5>
<Opcional {raiz} name={el}>
  <InputT
    bind:val={r["cProdANP"]}
    lab="Código de produto da ANP"
    pat={"[0-9]{9}"}
  />
  <InputT
    bind:val={r["descANP"]}
    lab="Descrição do Produto conforme ANP"
    aux="Utilizar a descrição de produtos do SIMP (Sistema de Informações de Movimentação de Produtos)"
    min={2}
    max={95}
  />
  {#if r["cProdANP"] == 210203001}
    <InputT
      bind:val={r["pGLP"]}
      opt
      lab="Percentual do GLP derivado do petróleo no produto GLP"
      aux="Valores de 0 a 100"
      pat={"0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?"}
    />
    <InputT
      bind:val={r["pGNn"]}
      opt
      lab="Percentual de gás natural nacional GLGNn para o produto GLP"
      aux="Valores de 0 a 100"
      pat={"0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?"}
    />
    <InputT
      bind:val={r["pGNi"]}
      opt
      lab="Percentual de gás natural importado GLGNi para o produto GLP"
      aux="Valores de 0 a 100"
      pat={"0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?"}
    />
    <InputT
      bind:val={r["vPart"]}
      opt
      lab="Valor de partida (por quilograma sem ICMS)"
      pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
    />
  {/if}
  <InputT
    bind:val={r["CODIF"]}
    opt
    lab="Código de autorização / registro do CODIF"
    aux="Informar apenas quando a UF utilizar o CODIF (Sistema de Controle do Diferimento do Imposto nas Operações com Álcool Etílico Anidro Combustível)"
    pat={"[0-9]{1,21}"}
  />
  <InputT
    bind:val={r["qTemp"]}
    opt
    lab="Quantidade de combustível faturada à temperatura ambiente"
    aux="Informar quando a quantidade faturada informada no campo de quantidade comercial tiver sido ajustada para uma temperatura diferente da ambiente"
    pat={"0.[1-9]{1}[0-9]{3}|0.[0-9]{3}[1-9]{1}|0.[0-9]{2}[1-9]{1}[0-9]{1}|0.[0-9]{1}[1-9]{1}[0-9]{2}|[1-9]{1}[0-9]{0,11}(.[0-9]{4})?"}
  />
  <Estado bind:UF={r["UFCons"]} incluirEX lab="UF de consumo" />
  <Cide {raiz} />
  <Encerrante {raiz} />
</Opcional>
