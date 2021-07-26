<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Opcional from "../components/Opcional.svelte";

  export let raiz: any;

  const el = "detExport";
  if (!raiz[el]) raiz[el] = {};
  let r = raiz[el];
</script>

<h5>Detalhe da exportação</h5>
<InputT
  bind:val={r["nDraw"]}
  opt
  lab="Número do ato concessório de Drawback"
  pat={"[0-9]{0,11}"}
/>
<h6>Exportação indireta</h6>
<Opcional {raiz} name="exportInd">
  <InputT
    bind:val={r["exportInd"]["nRE"]}
    lab="Registro de exportação"
    pat={"[0-9]{0,12}"}
  />
  <InputT
    bind:val={r["exportInd"]["chNFe"]}
    lab="Chave de acesso da NF-e recebida para exportação"
    pat={"[0-9]{44}"}
    max={44}
  />
  <InputT
    bind:val={r["exportInd"]["qExport"]}
    lab="Quantidade do item efetivamente exportado"
    pat={"0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?"}
  />
</Opcional>
