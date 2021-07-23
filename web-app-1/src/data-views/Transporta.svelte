<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Select from "../components/Select.svelte";

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

<!-- 
"element": [
  {
    "name": "xNome",
    "annotation": { "label": "Razão Social ou nome do transportador" },
    "restriction": { "maxLength": "60", "minLength": "2" }
  },
  {
    "name": "IE",
    "type": "TIeDest",
    "optional": true,
    "annotation": { "label": "Inscrição Estadual" }
  },
  {
    "name": "xEnder",
    "optional": true,
    "annotation": { "label": "Endereço completo" },
    "restriction": { "minLength": "1", "maxLength": "60" }
  },
  {
    "name": "xMun",
    "optional": true,
    "annotation": { "label": "Nome do munícipio" },
    "restriction": { "maxLength": "60", "minLength": "1" }
  },
  {
    "name": "UF",
    "type": "TUf",
    "optional": true,
    "annotation": { "label": "Sigla da UF" }
  }
]
 -->
