<script lang="ts">
  import { applyMask } from '@app/documentUtils'
  import type { TMask } from '@app/documentUtils'
  import { createId } from './helpers'

  export let optional = false
  export let label: string
  export let aux = ''
  export let pattern = undefined
  export let minlength: number = undefined
  export let maxlength: number = undefined
  export let mask: TMask = undefined
  export let value: string

  $: maskedValue = mask ? applyMask(value, mask) : ''

  const id = createId()
</script>

<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label" for={id}>
      {#if optional}
        <i>{label}</i>
      {:else}
        {label}
      {/if}
    </label>
  </div>
  <div class="field-body">
    <div class="field">
      <div class="control is-expanded">
        <input
          {id}
          class="input"
          required={!optional}
          {pattern}
          {minlength}
          {maxlength}
          type="text"
          bind:value
        />
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
