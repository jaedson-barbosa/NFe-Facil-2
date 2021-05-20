<script lang="ts">
  import { createId } from './helpers'

  export let el: any
  export let root: any
  $: { if (!root[el.name]) root[el.name] = '' }

  function getOptions(el: any) {
    const enumeration = el.restriction?.enumeration as string | string[]
    if (typeof enumeration == 'string') {
      return [{ value: enumeration, text: enumeration }]
    }
    const descs = el.annotation.itens
    return (enumeration as string[]).map((v, i) => {
      if (v.startsWith('/')) {
        return { value: v.slice(1), text: descs[i] }
      }
      const text = descs ? v + ' - ' + descs[i] : v
      return { value: v, text }
    })
  }
  $: options = getOptions(el)

  $: ({ aux, label } = el.annotation)
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
        <div class="select is-fullwidth">
          <select {id} bind:value={root[el.name]} {required}>
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
