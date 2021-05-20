<script lang="ts">
  import Select from './Select.svelte'
  import Elements from './Elements.svelte'

  export let level: number = 3
  export let root: any
  export let el: any

  $: choice = el.choice

  $: infoType = {
    name: 'currentType',
    annotation: {
      label: choice.annotation?.label ?? '',
      aux: choice.annotation?.aux ?? '',
      itens: choice.element.map(v => v.annotation.label)
    },
    restriction: { enumeration: choice?.element.map((_,i) => `/${i}`) }
  }

  let params = { currentType: '0' }
  $: elements = {name: el.name, ...choice.element[+params.currentType]}
</script>

<Select bind:root={params} el={infoType} />
<Elements {root} {level} el={elements} />
