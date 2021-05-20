<script lang="ts">
  import { createId } from './helpers'

  export let el: any
  export let root: any

  $: {
    const enumeration = el.restriction?.enumeration
    if (typeof enumeration == 'string') root[el.name] = enumeration
    else if (!root[el.name]) root[el.name] = ''
  }

  const { aux, label } = el.annotation
  const id = createId()
  $: required = !el.optional
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
          value={root[el.name]}
          readonly
        />
      </div>
      {#if aux}
        <p class="help">{aux}</p>
      {/if}
    </div>
  </div>
</div>
