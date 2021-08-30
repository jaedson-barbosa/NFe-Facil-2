<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Municipio from '../components/Municipio.svelte'
  import Opcional from '../components/Opcional.svelte'

  export let raiz: any
  export let name: 'retirada' | 'entrega'

  $: local = raiz[name]
</script>

<h3>
  {#if name == 'retirada'}
    Local de retirada
  {:else}
    Local de entrega
  {/if}
</h3>
<Opcional {raiz} {name}>
  {#if !local['CPF']}
    <InputT lab="CNPJ" mask="cnpj" bind:val={local['CNPJ']} pat={'[0-9]{14}'} />
  {/if}
  {#if !local['CNPJ']}
    <InputT
      lab="CPF"
      mask="cpf"
      bind:val={local['CPF']}
      max={11}
      pat={'[0-9]{11}'}
    />
  {/if}
  <InputT
    lab="Razão Social ou nome do destinatário"
    opt
    bind:val={local['xNome']}
    min={2}
    max={60}
  />
  <InputT lab="Logradouro" bind:val={local['xLgr']} min={2} max={60} />
  <InputT lab="Número" bind:val={local['nro']} min={1} max={60} />
  <InputT lab="Complemento" bind:val={local['xCpl']} opt min={1} max={60} />
  <InputT lab="Bairro" bind:val={local['xBairro']} min={2} max={60} />
  <Municipio
    bind:cMun={local['cMun']}
    bind:xMun={local['xMun']}
    bind:UF={local['UF']}
  />
  <InputT
    lab="CEP"
    mask="zipcode"
    opt
    bind:val={local['CEP']}
    pat={'[0-9]{8}'}
  />
  <InputT
    lab="Telefone"
    bind:val={local['fone']}
    opt
    aux={'DDD + número do telefone'}
    pat={'[0-9]{6,14}'}
  />
  <InputT
    lab="E-mail do destinatário"
    bind:val={local['email']}
    opt
    min={1}
    max={60}
  />
  {#if local['CNPJ']}
    <InputT
      lab="Inscrição Estadual"
      bind:val={local['IE']}
      opt
      max={14}
      pat={'[0-9]{2,14}'}
    />
  {/if}
</Opcional>
