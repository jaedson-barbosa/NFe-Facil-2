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

  const elements = el.choice.element.map((v) => {
    return { name: el.name, ...v }
  })

  let params = { currentType: '0' }
  let lastIndex = -1

  const curRoot = el.name ? root[el.name] ?? {} : root

  const els = (el.choice.element as any[]).map((v) => {
    if (v.name) {
      if (el.name) return !!curRoot[v.name]
      else return !!(root[v.name] = root[v.name] ?? '')
    }
    else return v.element.every((k) => {
      if (el.name) return !!curRoot[k.name] || !!k.optional
      else {
        if (root[k.name]) {
          const curEnum = k.restriction?.enumeration
          if (curEnum && typeof curEnum == 'string') {
            return curEnum == root[k.name]
          } else if (curEnum) {
            return curEnum.includes(root[k.name])
          } else return true
        }
        root[k.name] = ''
        return !!k.optional
      }
    })
  })
  const firstIndex = els.indexOf(true)
  if (firstIndex == els.lastIndexOf(true)) {
    if (firstIndex != -1) {
      params.currentType = firstIndex.toString()
    }
  } else {
    console.log(el)
    throw new Error('Multiple valid itens')
  }

  $: currentIndex = +params.currentType

  $: {
    if (currentIndex != lastIndex && lastIndex != -1) {
      if (el.name) {
        root[el.name] = {}
      } else {
        const lastEl = elements[lastIndex]
        if (lastEl.name) root[lastEl.name] = ''
        else lastEl.element.forEach((v) => (root[v.name] = ''))
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
