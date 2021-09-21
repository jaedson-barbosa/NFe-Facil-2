<script lang="ts">
  import IBGE from "../code/IBGE";

  export let lab: string = "Estado";
  export let opt: boolean = false;
  export let incluirEX = false

  export let cUF: string = "";
  export let UF: string = "";

  const estados = IBGE.map((v) => ({
    Nome: v.Nome,
    Codigo: v.Codigo,
    Sigla: v.Sigla
  })).sort((a, b) => a.Nome.localeCompare(b.Nome));
  if (incluirEX) {
    estados.push({
      Nome: "Exterior",
      Codigo: "99",
      Sigla: "EX"
    })
  }
  type TUF = typeof estados[0];

  let value: TUF;

  if (cUF && !value) value = estados.find((v) => v.Nome == cUF);
  if (UF && !value) value = estados.find((v) => v.Codigo == UF);

  $: {
    cUF = value?.Codigo;
    UF = value?.Sigla;
  }
</script>

<label>
  {lab}
  <select bind:value required={!opt}>
    {#each estados as uf}
      <option value={uf}>{uf.Nome}</option>
    {/each}
  </select>
</label>
