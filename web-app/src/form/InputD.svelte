<script lang="ts">
  import { onDestroy } from 'svelte'
  import { createId } from './helpers'

  export let optional = false
  export let label: string
  export let aux = ''
  export let decimal: number
  export let value: string

  const id = createId()

  function updateDecimal() {
    if (value) {
      let parsed = parseFloat(value.replace(',', '.'))
      if (Number.isNaN(parsed)) parsed = 0
      const o = parsed.toFixed(decimal)
      // Fixado o número mínimo de casas decimais em 2
      const start = o.indexOf('0', o.indexOf('.') + 3)
      value = start > 0 ? o.slice(0, start) : o
    }
  }

  onDestroy(() => {
    if (decimal) updateDecimal()
  })
</script>

<label for={id}>
  {#if optional}
    <i>{label}</i>
  {:else}
    {label}
  {/if}
</label>
<input
  {id}
  required={!optional}
  type="text"
  bind:value
  on:blur={updateDecimal}
/>
{#if aux}
  <small>{aux}</small>
{/if}
