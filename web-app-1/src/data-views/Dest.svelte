<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Municipio from '../components/Municipio.svelte'
  import Pais from '../components/Pais.svelte'
  import Doc from './Doc.svelte'

  export let raiz: any

  if (!raiz['dest']) raiz['dest'] = {}
  let dest = raiz['dest']

  if (!dest['enderDest']) dest['enderDest'] = {}
  let enderDest = dest['enderDest']

  enderDest.cPais = '1058'
  enderDest.xPais = 'BRASIL'

  $: {
    if (dest['idEstrangeiro']) {
      enderDest.cMun = '9999999'
      enderDest.xMun = 'EXTERIOR'
      enderDest.UF = 'EX'
    } else {
      enderDest.UF = enderDest.xMun = enderDest.cMun = ''
      enderDest.cPais = '1058'
      enderDest.xPais = 'BRASIL'
    }
    if (dest['CPF'] || dest['idEstrangeiro']) dest['indIEDest'] = '9'
  }
</script>

<h3>Destinatário</h3>
<Doc raiz={dest} />
<InputT
  lab="Razão Social ou nome do destinatário"
  bind:val={dest['xNome']}
  min={2}
  max={60}
/>
{#if dest['CNPJ']}
  <Select
    lab="Indicador da IE do destinatário"
    bind:val={dest['indIEDest']}
    els={[
      ['1', 'Contribuinte ICMS'],
      ['2', 'Contribuinte isento'],
      ['9', 'Não contribuinte'],
    ]}
  />
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

<h4>Endereço</h4>
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
  <Pais bind:cPais={enderDest['cPais']} bind:xPais={enderDest['xPais']} />
{/if}
<InputT
  lab="Telefone"
  bind:val={enderDest['fone']}
  opt
  aux={'DDD + número do telefone'}
  pat={'[0-9]{6,14}'}
/>
