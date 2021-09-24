<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Municipio from '../components/Municipio.svelte'
  import Doc from './Doc.svelte'

  export let raiz: any
  export let name: 'retirada' | 'entrega'

  let informar = raiz[name]
  $: raiz[name] = informar ? {} : undefined
  $: texto =
    name == 'entrega'
      ? 'Endereço de entrega diferente do endereço do destinatário'
      : 'Endereço de retirada diferente do endereço do remetente'
  $: pessoa = name == 'entrega' ? 'destinatário' : 'expedidor'
</script>

<label>
  <input type="checkbox" bind:checked={informar} />
  {texto}
</label>
{#if raiz[name]}
  <h2>Local de {name}</h2>
  <Doc bind:raiz={raiz[name]} apenasBR />
  <InputT
    lab="Razão Social ou nome do {pessoa}"
    opt
    bind:val={raiz[name]['xNome']}
    min={2}
    max={60}
  />
  <InputT lab="Logradouro" bind:val={raiz[name]['xLgr']} min={2} max={60} />
  <InputT lab="Número" bind:val={raiz[name]['nro']} min={1} max={60} />
  <InputT
    lab="Complemento"
    bind:val={raiz[name]['xCpl']}
    opt
    min={1}
    max={60}
  />
  <InputT lab="Bairro" bind:val={raiz[name]['xBairro']} min={2} max={60} />
  <Municipio
    bind:cMun={raiz[name]['cMun']}
    bind:xMun={raiz[name]['xMun']}
    bind:UF={raiz[name]['UF']}
  />
  <InputT
    lab="CEP"
    mask="zipcode"
    opt
    bind:val={raiz[name]['CEP']}
    pat={'[0-9]{8}'}
  />
  <InputT
    lab="Telefone"
    bind:val={raiz[name]['fone']}
    opt
    aux={'DDD + número do telefone'}
    pat={'[0-9]{6,14}'}
  />
  <InputT
    lab="E-mail do {pessoa}"
    bind:val={raiz[name]['email']}
    opt
    min={1}
    max={60}
  />
  {#if raiz[name]['CNPJ']}
    <InputT
      lab="Inscrição Estadual"
      bind:val={raiz[name]['IE']}
      opt
      max={14}
      pat={'[0-9]{2,14}'}
    />
  {/if}
{/if}
<br />
