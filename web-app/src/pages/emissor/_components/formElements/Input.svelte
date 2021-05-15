<script lang="ts">
  export let annotation: {
    label: string
    aux?: string
  }
  export let type: string
  export let restriction: {
    pattern?: string
    minLength?: number
    maxLength?: number
    decimal?: number
  }
  export let value: string = ''

  $: step = restriction.decimal
    ? (1 / 10 ** restriction.decimal).toString()
    : ''
  function handleChange(e: { currentTarget: HTMLInputElement }) {
    const text = e.currentTarget
    if (this.options.decimal) {
      text.onchange = () => {
        if (text.value) {
          const o = parseFloat(text.value).toFixed(this.options.decimal)
          // Fixado o número mínimo de casas decimais em 2
          text.value = o.slice(0, o.indexOf('0', o.indexOf('.') + 3))
        } else text.value = ''
      }
    }
    value = text.value
  }
</script>

<label title={annotation.aux}>
  {annotation.label + annotation.aux ? ' *' : ''}
  <input {type} {step} on:input={handleChange} />
</label>
