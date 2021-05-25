<script lang="ts">
  import { applyMask } from '@app/documentUtils'
  import { createId } from './helpers'

  export let el: any
  export let root: any
  
  $: {if (!root[el.name]) root[el.name] = ''}

  //#region decimal
  $: {
    if (root[el.name] && el.restriction.decimal) {
      const o = parseFloat(root[el.name]).toFixed(el.restriction.decimal)
      // Fixado o número mínimo de casas decimais em 2
      root[el.name] = o.slice(0, o.indexOf('0', o.indexOf('.') + 3))
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

  function getType() {
    // if (!/[a-zA-Z]|ÿ/.test(el.restriction?.pattern)) return 'number'
    return el.name == 'fone'
      ? 'tel'
      : el.name == 'email'
      ? 'email'
      : el.type == 'TData'
      ? 'date'
      : 'text'
  }
  //#endregion

  $: ({ aux, label } = el.annotation)
  const id = createId()
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
            step={1 / 10 ** el.restriction.decimal}
            type="number"
            bind:value={root[el.name]}
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
