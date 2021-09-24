<script lang="ts">
  import paises from '../code/paises'
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Municipio from '../components/Municipio.svelte'
  import Doc from './Doc.svelte'

  export let raiz: any

  if (!raiz.dest) raiz.dest = {}
  if (!raiz.dest.enderDest) raiz.dest.enderDest = { cPais: '1058' }

  $: dest = raiz.dest
  $: enderDest = raiz.dest.enderDest

  $: {
    if (dest['idEstrangeiro']) {
      enderDest.cMun = '9999999'
      enderDest.xMun = 'EXTERIOR'
      enderDest.UF = 'EX'
    } else {
      enderDest.UF = enderDest.xMun = enderDest.cMun = ''
      enderDest.cPais = '1058'
    }
    const cPais = enderDest['cPais']
    const pais = paises.find((v) => v.codigo == cPais)
    enderDest['xPais'] = pais.nome
    if (dest['CPF'] || dest['idEstrangeiro']) dest['indIEDest'] = '9'
  }
</script>

<Doc bind:raiz={raiz.dest} />
<InputT
  lab="Razão Social ou nome do destinatário"
  bind:val={dest['xNome']}
  min={2}
  max={60}
/>
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
  <InputT
    lab="Inscrição Estadual"
    bind:val={dest['IE']}
    opt
    max={14}
    pat={'[0-9]{2,14}'}
  />
{/if}
<InputT
  lab="Inscrição na SUFRAMA"
  bind:val={dest['ISUF']}
  opt
  pat={'[0-9]{8,9}'}
/>
<InputT
  lab="Inscrição Municipal do tomador do serviço"
  bind:val={dest['IM']}
  opt
  min={1}
  max={15}
/>
<InputT
  lab="E-mail do destinatário"
  bind:val={dest['email']}
  opt
  min={1}
  max={60}
/>

<h2>Endereço</h2>
<InputT lab="Logradouro" bind:val={enderDest['xLgr']} min={2} max={60} />
<InputT lab="Número" bind:val={enderDest['nro']} min={1} max={60} />
<InputT lab="Complemento" bind:val={enderDest['xCpl']} opt min={1} max={60} />
<InputT lab="Bairro" bind:val={enderDest['xBairro']} min={2} max={60} />
{#if !dest['idEstrangeiro']}
  <Municipio
    bind:cMun={enderDest['cMun']}
    bind:xMun={enderDest['xMun']}
    bind:UF={enderDest['UF']}
  />
{/if}
<InputT lab="CEP" mask="zipcode" bind:val={enderDest['CEP']} pat={'[0-9]{8}'} />
{#if dest['idEstrangeiro']}
  <label>
    País
    <select bind:value={enderDest['cPais']} required>
      {#each paises as v}
        <option value={v.codigo}>{v.nome}</option>
      {/each}
    </select>
  </label>
{/if}
<InputT
  lab="Telefone"
  bind:val={enderDest['fone']}
  opt
  aux={'DDD + número do telefone'}
  pat={'[0-9]{6,14}'}
/>
