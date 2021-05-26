<script>
  import { createId } from './helpers'

  export let required = true
  export let label
  export let aux
  export let value

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
        <input
          {id}
          class="input is-static"
          type="text"
          {value}
          readonly
        />
      </div>
      {#if aux}
        <p class="help">{aux}</p>
      {/if}
    </div>
  </div>
</div>