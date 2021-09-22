<script lang="ts">
  import { validaCNPJ, validaCPF } from '../code/validacaoDoc'
  import { aplicarMascara, mascaras } from '../code/mascaracaoDoc'

  export let opt = false
  export let lab: string
  export let aux = ''
  export let pat = undefined
  export let min: number = undefined
  export let max: number = undefined
  export let mask: mascaras = undefined
  export let raiz: any = {}
  export let name: string = ''
  export let val = raiz[name]
  $: raiz[name] = val

  $: maskedValue = mask ? aplicarMascara(val, mask) : ''

  let input: HTMLInputElement

  $: {
    if (mask == 'cpf') {
      input?.setCustomValidity(validaCPF(val) ? '' : 'CPF inválido.')
    } else if (mask == 'cnpj') {
      input?.setCustomValidity(validaCNPJ(val) ? '' : 'CNPJ inválido.')
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
