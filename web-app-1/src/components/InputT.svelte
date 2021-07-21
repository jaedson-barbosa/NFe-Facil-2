<script lang="ts">
  import { applyMask, isCnpjValid, isCpfValid } from '../app/documentUtils'
  import type { TMask } from '../app/documentUtils'

  export let opt = false
  export let lab: string
  export let aux = ''
  export let pat = undefined
  export let min: number = undefined
  export let max: number = undefined
  export let mask: TMask = undefined
  export let val: string

  $: maskedValue = mask ? applyMask(val, mask) : ''

  let input: HTMLInputElement

  $: {
    if (mask == 'cpf') {
      input?.setCustomValidity(isCpfValid(val) ? '' : 'CPF inválido.')
    } else if (mask == 'cnpj') {
      input?.setCustomValidity(isCnpjValid(val) ? '' : 'CNPJ inválido.')
    }
  }
</script>

<label>
  {#if opt}
    <i>{lab}</i>
  {:else}
    {lab}
  {/if}
  {#if aux || maskedValue}
    <small>
      {#if aux && maskedValue}
        {maskedValue} - {aux}
      {:else}
        {maskedValue}{aux ?? ''}
      {/if}
    </small>
  {/if}
  <input
    required={!opt}
    pattern={pat}
    minlength={min}
    maxlength={max}
    type="text"
    bind:this={input}
    bind:value={val}
  />
</label>
