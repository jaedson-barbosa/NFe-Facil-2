<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Opcional from "../components/Opcional.svelte";

  export let raiz: any;

  const el = "CIDE";
  if (!raiz[el]) raiz[el] = {};
  $: r = raiz[el];
</script>

<h6>CIDE (Contribuição de Intervenção no Domínio Econômico)</h6>
<Opcional {raiz} name={el}>
  <InputT
    bind:val={r["qBCProd"]}
    lab="BC do CIDE ( Quantidade comercializada)"
    pat={"0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(.[0-9]{1,4})?"}
  />
  <InputT
    bind:val={r["vAliqProd"]}
    lab="Alíquota do CIDE  (em reais)"
    pat={"0|0.[0-9]{4}|[1-9]{1}[0-9]{0,10}(.[0-9]{4})?"}
  />
  <InputT
    bind:val={r["vCIDE"]}
    lab="Valor do CIDE"
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
</Opcional>
