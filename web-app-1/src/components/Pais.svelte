<script lang="ts">
  import paises from '../code/paises'

  export let lab = 'País'
  export let opt = false

  export let cPais: string = ''
  export let xPais: string = ''

  type TPais = typeof paises[0]
  let value: TPais;

  if (cPais && !value) value = paises.find(v => v.codigo == cPais)
  if (xPais && !value) value = paises.find(v => v.nome == xPais)

  $: {
    cPais = value?.codigo
    xPais = value?.nome
  }
</script>

<label>
  {lab}
  <select bind:value required={!opt}>
    {#each paises as p}
      <option value={p}>{p.nome}</option>
    {/each}
  </select>
</label>