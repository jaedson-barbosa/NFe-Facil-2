<script lang="ts">
  import IBGE from "../app/IBGE";

  export let lab: string = "Estado";
  export let opt: boolean = false;
  export let incluirEX = false
  export let raiz: any = {}

  export let cUF: string = "";
  export let UF: string = "";

  export let cUFName: string = ''
  export let UFName: string = ''

  $: raiz[cUFName] = cUF
  $: raiz[UFName] = UF

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
