<script lang="ts">
  import Select from './Select.svelte'
  import Elements from './Elements.svelte'

  export let level: number = 3
  export let childRoot: any
  export let choice: any

  $: infoType = {
    name: 'currentType',
    annotation: {
      label: choice.annotation?.label ?? '',
      aux: choice.annotation?.aux ?? '',
      itens: choice.element.map(v => v.annotation.label)
    },
    restriction: { enumeration: choice?.element.map((_,i) => '/' + i.toString()) }
  }

  let params = {
    currentType: '0'
  }
  $: elements = choice.element[+params.currentType].element
</script>

<Select bind:root={params} el={infoType} />
<Elements {childRoot} {elements} {level} />
