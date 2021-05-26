<script lang="ts">
  import { applyMask } from '@app/documentUtils'
  import { onDestroy } from 'svelte';
  import { createId } from './helpers'

  export let el: any
  export let root: any
  
  $: {if (!root[el.name]) root[el.name] = ''}

  //#region decimal
  function updateDecimal() {
    if (root[el.name]) {
      let parsed = parseFloat(root[el.name].replace(',', '.'))
      if (Number.isNaN(parsed)) parsed = 0
      if (el.restriction.decimal < 2) {
        console.log(el)
        alert("AQUI")
      }
      const o = parsed.toFixed(el.restriction.decimal)
      // Fixado o número mínimo de casas decimais em 2
      const start = o.indexOf('0', o.indexOf('.') + 3)
      root[el.name] = start > 0 ? o.slice(0, start) : o
    }
  }
  //#endregion

  //#region generic
  const mask =
    el.type == 'TCpf'
      ? 'cpf'
      : el.type == 'TCnpj'
      ? 'cnpj'
      : el.name == 'CEP'
      ? 'zipcode'
      : ''
  $: maskedValue = mask ? applyMask(root[el.name], mask) : ''
  //#endregion

  $: ({ aux, label } = el.annotation)
  const id = createId()

  onDestroy(() => {
    if (el.restriction.decimal) updateDecimal()
  })
</script>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label" for={id}>
      {#if el.optional}
        <i>{label}</i>
      {:else}
        {label}
      {/if}
    </label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control is-expanded">
        {#if el.restriction.decimal}
          <input
            {id}
            class="input"
            required={!el.optional}
            pattern={el.restriction.pattern}
            type="text"
            bind:value={root[el.name]}
            on:blur={updateDecimal}
          />
        {:else}
          <input
            {id}
            class="input"
            required={!el.optional}
            pattern={el.restriction.pattern}
            minlength={el.restriction.minLength}
            maxlength={el.restriction.maxLength}
            type="text"
            bind:value={root[el.name]}
          />
        {/if}
      </div>
      {#if aux || maskedValue}
        <p class="help">
          {#if aux && maskedValue}
          {maskedValue} - {aux}
          {:else}
          {maskedValue}{aux ?? ''}
          {/if}
        </p>
      {/if}
    </div>
  </div>
</div>
