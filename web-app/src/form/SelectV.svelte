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
        <div class="select is-fullwidth">
          <select {id} bind:value {required}>
            {#each options as opt}
              <option value={opt.value}>{opt.text}</option>
            {/each}
          </select>
        </div>
      </div>
      {#if aux}
        <p class="help">{aux}</p>
      {/if}
    </div>
  </div>
</div>
