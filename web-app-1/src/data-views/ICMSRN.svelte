<script lang="ts">
  import { includes } from "lodash";

  import InputT from "../components/InputT.svelte";
  import Select from "../components/Select.svelte";

  export let raiz: any;

  const el = "ICMS";
  if (!raiz[el]) raiz[el] = {};
  let r = Object.values(raiz[el])[0] ?? (raiz[el][el + "00"] = { CST: "00" });

  const CST = "CST";
  $: {
    raiz[el] = {};
    const cst = r[CST] as string;
    const rn = el + (cst === "41" || cst === "50" ? "40" : cst);
    r = raiz[el][rn] = { CST: cst };
  }
</script>

<Select
  bind:val={r[CST]}
  lab="Código de situação tributária"
  els={[
    ["00", "Tributada integralmente"],
    ["10", "Tributada e com cobrança do ICMS por ST"],
    ["20", "Com redução de base de cálculo"],
    ["30", "Isenta ou não tributada e com cobrança do ICMS por ST"],
    ["40", "Isenta"],
    ["41", "Não tributada"],
    ["50", "Suspensão"],
    ["51", "Diferimento"],
    ["60", "ICMS cobrado anteriormente por ST"],
    ["70", "Com redução de base de cálculo e cobrança do ICMS por ST"],
    ["90", "Outras"],
  ]}
/>

<Select
  bind:val={r["orig"]}
  lab="Origem da mercadoria"
  els={[
    ["0", "Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8"],
    ["1", "Estrangeira - Importação direta, exceto a indicada no código 6"],
    [
      "2",
      "Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7",
    ],
    ["3", "Nacional, conteudo superior 40% e inferior ou igual a 70%"],
    ["4", "Nacional, processos produtivos básicos"],
    ["5", "Nacional, importação inferior ou igual a 40%"],
    ["6", "Estrangeira - Importação direta, sem similar nacional"],
    ["7", "Estrangeira - Adquirida no mercado interno, sem similar nacional"],
    ["8", "Nacional, importação superior a 70%"],
  ]}
/>
{#if ["00", "10", "20", "51", "70", "90"].includes(r[CST])}
  <Select
    bind:val={r["modBC"]}
    opt={r[CST] == "51"}
    lab="Modalidade de determinação da BC do ICMS"
    els={[
      ["0", "Margem Valor Agregado (%)"],
      ["1", "Pauta (valor)"],
      ["2", "Preço Tabelado Máximo (valor)"],
      ["3", "Valor da Operação"],
    ]}
  />
  {#if ["20", "51", "70", "90"].includes(r[CST])}
    <InputT
      bind:val={r["pRedBC"]}
      opt={r[CST] != "20"}
      lab="Percentual de redução da BC"
      pat={"0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
    />
  {/if}
  <InputT
    bind:val={r["vBC"]}
    opt={r[CST] == "51"}
    lab="Valor da BC do ICMS"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <InputT
    bind:val={r["pICMS"]}
    opt={r[CST] == "51"}
    lab="Alíquota do ICMS"
    pat={"0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  {#if r[CST] == "51"}
    <InputT
      bind:val={r["vICMSOp"]}
      opt
      lab="Valor do ICMS da Operação"
      pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
    />
    <InputT
      bind:val={r["pDif"]}
      opt
      lab="Percentual do diferemento"
      pat={"0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?"}
    />
    <InputT
      bind:val={r["vICMSDif"]}
      opt
      lab="Valor do ICMS da diferido"
      pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
    />
  {/if}
  <InputT
    bind:val={r["vICMS"]}
    opt={r[CST] == "51"}
    lab="Valor do ICMS"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
{/if}
{#if ["00", "10", "20", "51", "70", "90"].includes(r[CST])}
  {#if r[CST] != "00"}
    <InputT
      bind:val={r["vBCFCP"]}
      opt={!r["pFCP"] && !r["vFCP"]}
      lab="Base de cálculo"
      pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
    />
  {/if}
  <InputT
    bind:val={r["pFCP"]}
    opt={!r["vBCFCP"] && !r["vFCP"]}
    lab="Percentual"
    pat={"0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  <InputT
    bind:val={r["vFCP"]}
    opt={!r["vBCFCP"] && !r["pFCP"]}
    lab="Valor"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
{/if}
{#if ["10", "30", "70", "90"].includes(r[CST])}
  <Select
    bind:val={r["modBCST"]}
    lab="Modalidade de determinação da BC do ICMS ST"
    els={[
      ["0", "Preço tabelado ou máximo sugerido"],
      ["1", "Lista Negativa (valor)"],
      ["2", "Lista Positiva (valor)"],
      ["3", "Lista Neutra (valor)"],
      ["4", "Margem Valor Agregado (%)"],
      ["5", "Pauta (valor)"],
      ["6", "Valor da Operação"],
    ]}
  />
  <InputT
    bind:val={r["pMVAST"]}
    opt
    lab="Percentual da Margem de Valor Adicionado ICMS ST"
    pat={"0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  <InputT
    bind:val={r["pRedBCST"]}
    opt
    lab="Percentual de redução da BC ICMS ST"
    pat={"0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  <InputT
    bind:val={r["vBCST"]}
    lab="Valor da BC do ICMS ST"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <InputT
    bind:val={r["pICMSST"]}
    lab="Alíquota do ICMS ST"
    pat={"0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  <InputT
    bind:val={r["vICMSST"]}
    lab="Valor do ICMS ST"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
{/if}
{#if ["10", "30", "60", "70", "90"].includes(r[CST])}
  <InputT
    bind:val={r["vBCFCPST"]}
    opt={!r["pFCPST"] && !r["vFCPST"]}
    lab="Base de cálculo"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <InputT
    bind:val={r["pFCPST"]}
    opt={!r["vBCFCPST"] && !r["vFCPST"]}
    lab="Percentual"
    pat={"0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  <InputT
    bind:val={r["vFCPST"]}
    opt={!r["vBCFCPST"] && !r["pFCPST"]}
    lab="Valor"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
{/if}
{#if r[CST] == "60"}
  <InputT
    bind:val={r["vBCSTRet"]}
    opt={!["pST", "vICMSSubstituto", "vICMSSTRet"].some((v) => r[v])}
    lab="Valor da BC do ICMS ST retido anteriormente"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <InputT
    bind:val={r["pST"]}
    opt={!["vBCSTRet", "vICMSSubstituto", "vICMSSTRet"].some((v) => r[v])}
    lab="Aliquota suportada pelo consumidor final"
    pat={"0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  <InputT
    bind:val={r["vICMSSubstituto"]}
    opt
    lab="Valor do ICMS Próprio do Substituto cobrado em operação anterior"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <InputT
    bind:val={r["vICMSSTRet"]}
    opt={!["vBCSTRet", "pST", "vICMSSubstituto"].some((v) => r[v])}
    lab="Valor do ICMS ST retido anteriormente"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <InputT
    bind:val={r["vBCFCPSTRet"]}
    opt={!r["pFCPSTRet"] && !r["vFCPSTRet"]}
    lab="Base de cálculo"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <InputT
    bind:val={r["pFCPSTRet"]}
    opt={!r["vBCFCPSTRet"] && !r["vFCPSTRet"]}
    lab="Percentual"
    pat={"0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  <InputT
    bind:val={r["vFCPSTRet"]}
    opt={!r["vBCFCPSTRet"] && !r["pFCPSTRet"]}
    lab="Valor"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <InputT
    bind:val={r["pRedBCEfet"]}
    opt={!["vBCEfet", "pICMSEfet", "vICMSEfet"].some(v => r[v])}
    lab="Percentual de redução da BC"
    pat={"0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  <InputT
    bind:val={r["vBCEfet"]}
    opt={!["pRedBCEfet", "pICMSEfet", "vICMSEfet"].some(v => r[v])}
    lab="Base de cálculo"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <InputT
    bind:val={r["pICMSEfet"]}
    opt={!["pRedBCEfet", "vBCEfet", "vICMSEfet"].some(v => r[v])}
    lab="Alíquota"
    pat={"0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?"}
  />
  <InputT
    bind:val={r["vICMSEfet"]}
    opt={!["pRedBCEfet", "vBCEfet", "pICMSEfet"].some(v => r[v])}
    lab="Valor"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
{/if}
{#if ["20", "30", "40", "41", "50", "70", "90"].includes(r[CST])}
  <InputT
    bind:val={r["vICMSDeson"]}
    opt={!r["motDesICMS"]}
    lab="Valor do ICMS desonerado"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
  <!-- Analisar opções para cada CST, eles são diferentes -->
  <Select
    bind:val={r["motDesICMS"]}
    opt={!r["vICMSDeson"]}
    lab="Motivo da desoneração"
    els={[
      ["3", "Uso na agropecuária"],
      ["9", "Outros"],
      ["12", "Fomento agropecuário"],
    ]}
  />
{/if}
<!-- Corrigir labels dos controles -->
