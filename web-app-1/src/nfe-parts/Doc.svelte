<script lang="ts">
  import InputT from '../components/InputT.svelte'

  export let raiz: any
  export let apenasBR: boolean = false

  let br: string = raiz['CPF'] ? raiz['CPF'] : raiz['CNPJ']
  $: {
    raiz['CPF'] = br.length == 11 ? br : ''
    raiz['CNPJ'] = br.length == 14 ? br : ''
  }
</script>

{#if !raiz['idEstrangeiro']}
  <InputT
    lab="CPF/CNPJ"
    mask={br.length <= 11 ? 'cpf' : 'cnpj'}
    min={11}
    max={14}
    bind:val={br}
    pat={'[0-9]{11}|[0-9]{14}'}
  />
{/if}
{#if !apenasBR && !br}
  <InputT
    lab="Id estrangeiro"
    bind:val={raiz['idEstrangeiro']}
    pat={'([!-ÿ]{0}|[!-ÿ]{5,20})?'}
  />
{/if}
