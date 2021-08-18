<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Municipio from '../components/Municipio.svelte'

  export let raiz: any

  if (!raiz['transporta']) raiz['transporta'] = {}
  let transporta = raiz['transporta']
</script>

<h3>Transportador</h3>
{#if !transporta['CPF']}
  <InputT
    lab="CNPJ"
    mask="cnpj"
    bind:val={transporta['CNPJ']}
    pat={'[0-9]{14}'}
  />
{/if}
{#if !transporta['CNPJ']}
  <InputT
    lab="CPF"
    mask="cpf"
    bind:val={transporta['CPF']}
    max={11}
    pat={'[0-9]{11}'}
  />
{/if}
<InputT
  lab="Razão Social ou nome do transportador"
  min={2}
  max={60}
  bind:val={transporta['xNome']}
/>
<InputT
  opt
  lab="Inscrição Estadual"
  pat={'ISENTO|[0-9]{2,14}'}
  max={14}
  bind:val={transporta['IE']}
/>
<InputT
  opt
  lab="Endereço completo"
  min={1}
  max={60}
  bind:val={transporta['xEnder']}
/>
<Municipio bind:xMun={transporta['xMun']} bind:UF={transporta['UF']} />
