<script lang="ts">
  export let el: any
  export let id: string
  export let root: any
  let value = root[el.name]

  $: {
    root[el.name] = value ?? (value = '')
    root = root
  }

  const restriction = el.restriction as {
    pattern?: string
    decimal?: number
  }

  function handleChange(e: { currentTarget: HTMLInputElement }) {
    const text = e.currentTarget
    if (text.value) {
      const o = parseFloat(text.value).toFixed(restriction.decimal)
      // Fixado o número mínimo de casas decimais em 2
      text.value = o.slice(0, o.indexOf('0', o.indexOf('.') + 3))
    } else text.value = ''
    value = text.value
  }
</script>

<input
  {id}
  class="input"
  required={!el.optional}
  pattern={restriction.pattern}
  step={1 / 10 ** restriction.decimal}
  type="number"
  on:change={handleChange}
/>