<script lang="ts">
  import { onDestroy } from 'svelte'
  import { createId } from './helpers'

  export let el: any
  export let value: string = ''

  $: restriction = el.restriction as {
    pattern?: string
    minLength?: number
    maxLength?: number
    decimal?: number
  }

  function handleChange(e: { currentTarget: HTMLInputElement }) {
    const text = e.currentTarget
    if (text.value) {
      const o = parseFloat(text.value).toFixed(restriction.decimal)
      // Fixado o número mínimo de casas decimais em 2
      text.value = o.slice(0, o.indexOf('0', o.indexOf('.') + 3))
    } else text.value = ''
    value = text.value
  }

  function getType() {
    if (el.name == 'fone') return 'tel'
    if (el.name == 'email') return 'email'
    if (el.type == 'TData') return 'date'
    if (!/[a-zA-Z]|ÿ/.test(el.restriction?.pattern)) return 'number'
    return 'text'
  }

  const { aux, label } = el.annotation
  const id = createId()
  const required = !el.optional

  const initialValue = value
  onDestroy(() => (value = initialValue))
</script>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label" for={id}>
      {#if required}
        {label}
      {:else}
        <i>{label}</i>
      {/if}
    </label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control is-expanded">
        {#if restriction.decimal}
          <input
            class="input"
            {required}
            pattern={restriction.pattern}
            step={1 / 10 ** restriction.decimal}
            type="number"
            on:change={handleChange}
          />
        {:else}
          <input
            class="input"
            {required}
            pattern={restriction.pattern}
            minlength={restriction.minLength}
            maxlength={restriction.maxLength}
            type={getType()}
            on:change={(e) => (value = e.currentTarget.value)}
          />
        {/if}
      </div>
      {#if aux}
        <p class="help">{aux}</p>
      {/if}
    </div>
  </div>
</div>
