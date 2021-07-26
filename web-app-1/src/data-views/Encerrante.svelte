<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Opcional from "../components/Opcional.svelte";

  export let raiz: any;

  const el = "encerrante";
  if (!raiz[el]) raiz[el] = {};
  $: r = raiz[el];
</script>

<h6>Encerrante</h6>
<Opcional {raiz} name={el}>
  <InputT
    bind:val={r["nBico"]}
    lab="Numero do bico utilizado no abastecimento"
    pat={"[0-9]{1,3}"}
  />
  <InputT
    bind:val={r["nBomba"]}
    opt
    lab="Numero da bomba, caso exista"
    pat={"[0-9]{1,3}"}
  />
  <InputT
    bind:val={r["nTanque"]}
    lab="Numero de identificação do tanque"
    pat={"[0-9]{1,3}"}
  />
  <InputT
    bind:val={r["vEncIni"]}
    lab="Valor do Encerrante no ínicio do abastecimento"
    pat={"0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?"}
  />
  <InputT
    bind:val={r["vEncFin"]}
    lab="Valor do Encerrante no final do abastecimento"
    pat={"0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?"}
  />
</Opcional>
