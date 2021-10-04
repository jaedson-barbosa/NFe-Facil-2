<script lang="ts">
  import IBGE from '../code/IBGE'

  export let lab: string = 'Município'
  export let opt: boolean = false

  export let xMun: string = ''
  export let cMun: string = ''
  export let cUF: string = ''
  export let UF: string = ''

  let uf: typeof IBGE[0]
  let value: { Nome: string; Codigo: string }

  if (cMun) {
    const cUF = cMun.substr(0, 2)
    uf = IBGE.find(v => v.Codigo == cUF)
    value = uf.Municipios.find(v => v.Codigo == cMun)
  } else if (xMun && UF) {
    uf = IBGE.find(v => v.Sigla == UF)
    value = uf.Municipios.find(v => v.Nome == xMun)
  } else {
    uf = IBGE[0]
    value = uf.Municipios[0]
  }

  $: {
    if (value) {
      xMun = value.Nome
      cMun = value.Codigo
      cUF = value.Codigo.substr(0, 2)
      UF = IBGE.find(v => v.Codigo == cUF).Sigla
    } else {
      xMun = cMun = cUF = UF = ''
    }
  }
</script>

<label>
  Estado
  <select bind:value={uf} required={!opt}>
    {#each IBGE as uf}
      <option value={uf}>{uf.Nome}</option>
    {/each}
  </select>
</label>

<label>
  {lab}
  <select bind:value required={!opt}>
    {#each uf.Municipios as mun}
      <option value={mun}>{mun.Nome}</option>
    {/each}
  </select>
</label>