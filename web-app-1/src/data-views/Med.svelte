<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Opcional from "../components/Opcional.svelte";

  export let raiz: any;

  const el = "med";
  if (!raiz[el]) raiz[el] = {};
  $: r = raiz[el];
</script>

<h5>Medicamento</h5>
<Opcional {raiz} name={el}>
  <InputT
    bind:val={r["cProdANVISA"]}
    lab="Registro ANVISA (usar literal ISENTO no caso de medicamento isento de registro na ANVISA"
    pat={"[0-9]{13}|ISENTO"}
  />
  {#if r["cProdANVISA"] == "ISENTO"}
    <InputT
      bind:val={r["xMotivoIsencao"]}
      opt
      lab="Motivo da isenção"
      aux="Para medicamento isento de registro na ANVISA, informar o número da decisão que o isenta, como por exemplo o número da Resolução da Diretoria Colegiada da ANVISA (RDC)"
      min={1}
      max={255}
    />
  {/if}
  <InputT
    bind:val={r["vPMC"]}
    lab="Preço máximo ao consumidor."
    pat={"0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?"}
  />
</Opcional>
