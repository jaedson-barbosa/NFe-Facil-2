<script lang="ts">
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import { validaDoc } from '../code/validacaoDoc'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let raiz: any
  export let apenasBR: boolean = false
  export let simplificado = false

  let br: string = raiz['CPF'] ? raiz['CPF'] : raiz['CNPJ'] ?? ''
  $: {
    raiz['CPF'] = br.length <= 11 ? br : ''
    raiz['CNPJ'] = br.length > 11 ? br : ''
  }

  function onInvalido() {
    br = ''
    dispatch('invalido')
  }
</script>

{#if !raiz['idEstrangeiro']}
  {#if apenasBR && simplificado}
    <input
      required
      pattern="[0-9]{11}|[0-9]{14}"
      minlength={11}
      maxlength={14}
      bind:value={br}
      on:blur={() => validaDoc(br) || onInvalido()}
    />
  {:else}
    <label>
      CPF/CNPJ
      <small>{aplicarMascara(br, br.length <= 11 ? 'cpf' : 'cnpj')}</small>
      <input
        required
        pattern="[0-9]{11}|[0-9]{14}"
        minlength={11}
        maxlength={14}
        bind:value={br}
        on:blur={() => validaDoc(br) || onInvalido()}
      />
    </label>
  {/if}
{/if}
{#if !apenasBR && !br}
  <label>
    Id estrangeiro
    <input
      required
      pattern={'([!-ÿ]{0}|[!-ÿ]{5,20})?'}
      bind:value={raiz['idEstrangeiro']}
      on:blur={() => raiz['idEstrangeiro'].length || onInvalido()}
    />
  </label>
{/if}
