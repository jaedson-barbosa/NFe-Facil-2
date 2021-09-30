<script lang="ts">
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import paises from '../code/paises'
  import Municipio from '../components/Municipio.svelte'
  import Doc from '../components/Doc.svelte'

  export let raiz: any

  if (!raiz.dest) raiz.dest = {}
  if (!raiz.dest.enderDest) raiz.dest.enderDest = { cPais: '1058' }

  $: dest = raiz.dest
  $: ender = raiz.dest.enderDest

  $: {
    if (dest['idEstrangeiro']) {
      ender.cMun = '9999999'
      ender.xMun = 'EXTERIOR'
      ender.UF = 'EX'
    } else {
      ender.UF = ender.xMun = ender.cMun = ''
      ender.cPais = '1058'
    }
    const cPais = ender['cPais']
    const pais = paises.find((v) => v.codigo == cPais)
    ender['xPais'] = pais.nome
    if (dest['CPF'] || dest['idEstrangeiro']) dest['indIEDest'] = '9'
  }
</script>

<Doc bind:raiz={raiz.dest} />
<label>
  Razão social ou nome
  <input minlength="2" maxlength="60" bind:value={dest['xNome']} required />
</label>
{#if dest['CNPJ']}
  <label>
    Indicador da IE do destinatário
    <select bind:value={dest.indIEDest} required>
      <option value="1">Contribuinte ICMS</option>
      <option value="2">Contribuinte isento</option>
      <option value="9">Não contribuinte</option>
    </select>
  </label>
{/if}
{#if dest['indIEDest'] == '1'}
  <label>
    Inscrição Estadual
    <small>Usar literal 'ISENTO' se necessário</small>
    <input
      maxlength="14"
      pattern={'[0-9]{(2, 14)}|ISENTO'}
      bind:value={dest['IE']}
      required
    />
  </label>
{/if}
<label>
  <i>Inscrição na SUFRAMA</i>
  <input pattern={'[0-9]{8,9}'} bind:value={dest['ISUF']} />
</label>
<label>
  <i>Inscrição Municipal</i>
  <input maxlength="15" bind:value={dest['IM']} />
</label>
<label>
  <i>E-mail</i>
  <input maxlength="60" bind:value={dest['email']} />
</label>

<h2>Endereço</h2>
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
{#if !dest['idEstrangeiro']}
  <Municipio
    bind:cMun={ender['cMun']}
    bind:xMun={ender['xMun']}
    bind:UF={ender['UF']}
  />
{/if}
<label>
  CEP {aplicarMascara(ender['CEP'], 'zipcode')}
  <input pattern={'[0-9]{8}'} bind:value={ender['CEP']} required />
</label>
{#if dest['idEstrangeiro']}
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
