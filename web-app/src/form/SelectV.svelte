<script lang="ts">
  import { createId } from './helpers'

  export let required: boolean
  export let label: string
  export let aux = ''
  export let value: string
  export let options: {
    value: string
    text: string
  }[]

  const id = createId()
</script>

<label for={id}>
  {#if required}
    {label}
  {:else}
    <i>{label}</i>
  {/if}
</label>
<select {id} bind:value {required}>
  {#each options as opt}
    <option value={opt.value}>{opt.text}</option>
  {/each}
</select>
{#if aux}
  <small>{aux}</small>
{/if}
