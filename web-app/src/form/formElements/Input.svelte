<script lang="ts">
  import { createId } from './helpers'
  import Decimal from './InputControls/Decimal.svelte'
  import Generic from './InputControls/Generic.svelte'

  export let el: any
  export let root: any
  $: { if (typeof root[el.name] != 'string') root[el.name] = '' }

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
          <Decimal {el} {id} bind:value={root[el.name]} />
        {:else}
          <Generic {el} {id} bind:value={root[el.name]} />
        {/if}
      </div>
      {#if aux}
        <p class="help">{aux}</p>
      {/if}
    </div>
  </div>
</div>
