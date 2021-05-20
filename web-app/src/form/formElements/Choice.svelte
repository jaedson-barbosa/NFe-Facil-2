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
      itens: choice.element.map((v) => v.annotation.label),
    },
    restriction: { enumeration: choice?.element.map((_, i) => `/${i}`) },
  }

  let params = { currentType: '0' }
  $: currentIndex = +params.currentType

  const elements = el.choice.element.map((v) => {
    return { name: el.name, ...v }
  })

  let lastIndex = -1

  if (!el.name) {
    elements.forEach(v => {
      if (v.name) root[v.name] = ''
      else v.element.forEach(k => root[k.name] = '')
    })
  }

  $: {
    if (currentIndex != lastIndex && lastIndex != -1) {
      if (el.name) {
        root[el.name] = {}
      } else {
        const lastEl = elements[lastIndex]
        if (lastEl.name) root[lastEl.name] = ''
        else lastEl.element.forEach(v => root[v.name] = '')
      }
    }
    lastIndex = currentIndex
  }
</script>

<Select bind:root={params} el={infoType} />
{#each elements as elChild, i (elChild)}
  {#if i == currentIndex}
    <Elements {root} {level} el={elChild} />
  {/if}
{/each}
