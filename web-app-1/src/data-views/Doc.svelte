<script lang="ts">
  import InputT from '../components/InputT.svelte'

  export let raiz: any
  export let apenasBR: boolean = false
</script>

{#if !raiz['CPF'] && !raiz['idEstrangeiro']}
  <InputT lab="CNPJ" mask="cnpj" bind:val={raiz['CNPJ']} pat={'[0-9]{14}'} />
{/if}
{#if !raiz['CNPJ'] && !raiz['idEstrangeiro']}
  <InputT
    lab="CPF"
    mask="cpf"
    bind:val={raiz['CPF']}
    max={11}
    pat={'[0-9]{11}'}
  />
{/if}
{#if !apenasBR && !raiz['CPF'] && !raiz['CNPJ']}
  <InputT
    lab="Id estrangeiro"
    bind:val={raiz['idEstrangeiro']}
    pat={'([!-ÿ]{0}|[!-ÿ]{5,20})?'}
  />
{/if}
