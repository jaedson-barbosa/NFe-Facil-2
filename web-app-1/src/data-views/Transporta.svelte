<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Select from "../components/Select.svelte";
  import Municipio from "../components/Municipio.svelte";

  export let raiz: any;

  const el = "transporta";
  if (!raiz[el]) raiz[el] = {};
  let r = raiz[el];
</script>

<h3>Dados do transportador</h3>
{#if !r["CPF"]}
  <InputT lab="CNPJ" mask="cnpj" bind:val={r["CNPJ"]} pat={"[0-9]{14}"} />
{/if}
{#if !r["CNPJ"]}
  <InputT lab="CPF" mask="cpf" bind:val={r["CPF"]} max={11} pat={"[0-9]{11}"} />
{/if}
<InputT
  lab="Razão Social ou nome do transportador"
  min={2}
  max={60}
  bind:val={r["xNome"]}
/>
<InputT
  opt
  lab="Inscrição Estadual"
  pat={"ISENTO|[0-9]{2,14}"}
  max={14}
  bind:val={r["IE"]}
/>
<InputT opt lab="Endereço completo" min={1} max={60} bind:val={r["xEnder"]} />
<Municipio bind:xMun={r["xMun"]} bind:UF={r["UF"]} />
