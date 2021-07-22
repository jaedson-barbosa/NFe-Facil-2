<script lang="ts">
  import IBGE from "../app/IBGE";

  export let lab: string = "Município";
  export let opt: boolean = false;

  export let xMun: string = "";
  export let cMun: string = "";
  export let cMunFG: string = "";
  export let cUF: string = "";
  export let UF: string = "";

  const municipios = IBGE.flatMap((v) =>
    v.Municipios.map((k) => ({ ...k, codUF: v.Codigo, siglaUF: v.Sigla }))
  ).sort((a, b) => a.Nome.localeCompare(b.Nome));
  type TMun = typeof municipios[0];

  let value: TMun;

  if (xMun && !value) value = municipios.find((v) => v.Nome == xMun);
  if (cMun && !value) value = municipios.find((v) => v.Codigo == cMun);
  if (cMunFG && !value) value = municipios.find((v) => v.Codigo == cMunFG);

  $: {
    xMun = value?.Nome;
    cMun = value?.Codigo;
    cMunFG = value?.Codigo;
    cUF = value?.codUF;
    UF = value?.siglaUF;
  }
</script>

<label>
  {lab}
  <select bind:value required={!opt}>
    {#each municipios as mun}
      <option value={mun}>{mun.Nome} - {mun.siglaUF}</option>
    {/each}
  </select>
</label>
