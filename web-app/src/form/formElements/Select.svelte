<script lang="ts">
  import { onDestroy } from "svelte";
  import { createId } from "./helpers";

  export let el: any;
  export let value: string = ''

  function getOptions() {
    const enumeration = el.restriction?.enumeration as string | string[]
    if (typeof enumeration == 'string') {
      return [{value: enumeration, text: enumeration}]
    }
    const descs = el.annotation.itens
    return (enumeration as any[]).map((v, i) => {
      const text = descs ? v + ' - ' + descs[i] : v
      return { value: v, text }
    })
  }
  const options = getOptions()

  const {aux, label} = el.annotation
  const id = createId()
  const required = !el.optional

  const initialValue = value = required ? options[0].value : ''
  onDestroy(() => value = initialValue)
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
          <select {id} bind:value={value} {required}>
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
