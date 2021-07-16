<script>
  import { createId } from './helpers'

  export let required = true
  export let label
  export let aux = ''
  export let value

  const id = createId()
</script>

<label for={id}>
  {#if required}
    {label}
  {:else}
    <i>{label}</i>
  {/if}
</label>
<input
  {id}
  class="input is-static"
  type="text"
  {value}
  readonly
/>
{#if aux}
  <small>{aux}</small>
{/if}