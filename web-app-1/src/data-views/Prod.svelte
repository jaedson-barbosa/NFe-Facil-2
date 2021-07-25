<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Select from "../components/Select.svelte";

  export let raiz: any;

  const el = "prod";
  if (!raiz[el]) raiz[el] = {};
  let r = raiz[el];

  $: {
    r["vProd"] = (+r["qCom"] * +r["vUnCom"]).toFixed(2);
  }
</script>

<h4>Dados dos produtos e serviços</h4>
<InputT
  bind:val={r["cProd"]}
  lab="Código do produto ou serviço"
  aux="Preencher com CFOP caso se trate de itens não relacionados com mercadorias/produto e que o contribuinte não possua codificação própria (Formato: CFOP9999)"
  min={1}
  max={60}
/>
<InputT
  bind:val={r["cEAN"]}
  lab="GTIN do produto, antigo código EAN ou código de barras"
  pat={"SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}"}
/>
<InputT
  bind:val={r["xProd"]}
  lab="Descrição do produto ou serviço"
  min={1}
  max={120}
/>
<InputT
  bind:val={r["NCM"]}
  lab="Código NCM"
  aux="É permitida a informação do gênero (posição do capítulo do NCM) quando a operação não for de comércio exterior (importação/exportação) ou o produto não seja tributado pelo IPI. Em caso de item de serviço ou item que não tenham produto (Ex. transferência de crédito, crédito do ativo imobilizado, etc.), informar o código 00"
  pat={"[0-9]{2}|[0-9]{8}"}
/>
<InputT
  bind:val={r["NVE"]}
  opt
  lab="Nomenclatura de Valor aduaneio e Estatístico"
  pat={"[A-Z]{2}[0-9]{4}"}
/>
<InputT
  bind:val={r["cBenef"]}
  opt
  lab="Código de Benefício Fiscal na UF aplicado ao item"
  pat={"([!-ÿ]{8}|[!-ÿ]{10}|SEM CBENEF)?"}
/>
<InputT bind:val={r["EXTIPI"]} opt lab="Código EX TIPI" pat={"[0-9]{2,3}"} />
<InputT
  bind:val={r["CFOP"]}
  lab="CFOP (Código Fiscal de Operações e Prestações)"
  pat={"[1,2,3,5,6,7]{1}[0-9]{3}"}
/>
<InputT bind:val={r["uCom"]} lab="Unidade comercial" min={1} max={6} />
<InputT
  bind:val={r["qCom"]}
  lab="Quantidade Comercial  do produto"
  pat={"0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?"}
/>
<InputT
  bind:val={r["vUnCom"]}
  lab="Valor unitário de comercialização"
  pat={"0|0.[0-9]{1,10}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,10})?"}
/>
<InputT
  bind:val={r["cEANTrib"]}
  lab="GTIN da unidade tributável, antigo código EAN ou código de barras"
  pat={"SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}"}
/>
<InputT bind:val={r["uTrib"]} lab="Unidade Tributável" min={1} max={6} />
<InputT
  bind:val={r["qTrib"]}
  lab="Quantidade Tributável"
  pat={"0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?"}
/>
<InputT
  bind:val={r["vUnTrib"]}
  lab="Valor unitário de tributação"
  pat={"0|0.[0-9]{1,10}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,10})?"}
/>
<InputT
  bind:val={r["vFrete"]}
  opt
  lab="Valor Total do Frete"
  pat={"0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
/>
<InputT
  bind:val={r["vSeg"]}
  opt
  lab="Valor Total do Seguro"
  pat={"0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
/>
<InputT
  bind:val={r["vDesc"]}
  opt
  lab="Valor do Desconto"
  pat={"0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
/>
<InputT
  bind:val={r["vOutro"]}
  opt
  lab="Outras despesas acessórias"
  pat={"0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
/>
<Select
  bind:val={r["indTot"]}
  lab="O valor do item compõe o valor total da NF-e"
  els={[
    ["1", "Sim"],
    ["0", "Não"],
  ]}
/>
<h5>Declaração de Importação</h5>
