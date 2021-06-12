<script lang="ts">
  import SelectV from './SelectV.svelte'

  export let el: any
  export let root: any

  function getOptions(el: any): {
    value: string
    text: string
  }[] {
    const enumeration = el.restriction?.enumeration as string | string[]
    if (typeof enumeration == 'string') {
      return [{ value: enumeration, text: enumeration }]
    }
    const descs = el.annotation.itens
    const result = (enumeration as string[]).map((v, i) => {
      if (v.startsWith('/')) {
        return { value: v.slice(1), text: descs[i] }
      }
      const text = descs ? v + ' - ' + descs[i] : v
      return { value: v, text }
    })
    return el.optional
      ? [{ value: '', text: 'Não informar' }, ...result]
      : result
  }
  $: options = getOptions(el)
  $: {
    if (!root[el.name]) root[el.name] = options[0].value
  }
</script>

<SelectV
  required={!el.optional}
  label={el.annotation.label}
  aux={el.annotation.aux}
  {options}
  bind:value={root[el.name]}
/>
