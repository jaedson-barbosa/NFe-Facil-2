<script lang="ts">
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import { validaCNPJ } from '../code/validacaoDoc'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  export let required = false
  export let CNPJ: any
  export let label = 'CNPJ'
  export let aux = ''
  export let simplificado = false

  function onInvalido() {
    CNPJ = ''
    dispatch('invalido')
  }
</script>

{#if simplificado}
  <input
    {required}
    pattern="[0-9]{14}"
    minlength={14}
    maxlength={14}
    bind:value={CNPJ}
    on:blur={() => validaCNPJ(CNPJ) || onInvalido()}
  />
{:else}
  <label>
    {#if required} {label} {:else} <i>{label}</i> {/if}
    <small>
      {aplicarMascara(CNPJ, 'cnpj')}
      {#if aux} - {aux} {/if}
    </small>
    <input
      {required}
      pattern="[0-9]{14}"
      minlength={14}
      maxlength={14}
      bind:value={CNPJ}
      on:blur={() => validaCNPJ(CNPJ) || onInvalido()}
    />
  </label>
{/if}
