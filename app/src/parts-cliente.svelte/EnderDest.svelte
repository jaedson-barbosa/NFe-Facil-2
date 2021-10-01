<script lang="ts">
  import paises from '../code/paises'
  import Municipio from '../components/Municipio.svelte'
  import CEP from '../components/CEP.svelte'

  export let ender: any
  export let estrangeiro: boolean
  let lastEstrangeiro = estrangeiro
  $: {
    if (estrangeiro != lastEstrangeiro) {
      if (estrangeiro) {
        ender.cMun = '9999999'
        ender.xMun = 'EXTERIOR'
        ender.UF = 'EX'
      } else {
        ender.UF = ender.xMun = ender.cMun = ''
        ender.cPais = '1058'
      }
      lastEstrangeiro = estrangeiro
    }
    const cPais = ender['cPais']
    const pais = paises.find((v) => v.codigo == cPais)
    ender['xPais'] = pais.nome
  }
</script>

<h2>Endereço</h2>
{#if !estrangeiro}
  <Municipio
    bind:cMun={ender.cMun}
    bind:xMun={ender.xMun}
    bind:UF={ender.UF}
  />
{/if}
<label>
  Logradouro
  <input minlength="2" maxlength="60" bind:value={ender['xLgr']} required />
</label>
<label>
  Número
  <input maxlength="60" bind:value={ender['nro']} required />
</label>
<label>
  <i>Complemento</i>
  <input maxlength="60" bind:value={ender['xCpl']} />
</label>
<label>
  Bairro
  <input minlength="2" maxlength="60" bind:value={ender['xBairro']} required />
</label>
<CEP
  bind:CEP={ender.CEP}
  UF={ender.UF}
  Municipio={ender.xMun}
  Logradouro={ender.xLgr}
/>
{#if estrangeiro}
  <label>
    País
    <select bind:value={ender['cPais']} required>
      {#each paises as v}
        <option value={v.codigo}>{v.nome}</option>
      {/each}
    </select>
  </label>
{/if}
<label>
  <i>Telefone</i>
  <input pattern={'[0-9]{6,14}'} bind:value={ender['fone']} />
</label>
