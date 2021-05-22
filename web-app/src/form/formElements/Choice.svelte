<script context="module">
  const custom = {
    isSimples: true,
    isNormal: false,
  }
</script>

<script lang="ts">
  import Select from './Select.svelte'
  import Elements from './Elements.svelte'
  import AutoForm from '@form/AutoForm.svelte'

  export let level: number = 3
  export let root: any
  export let el: any

  const elements = (el.choice.element as any[]).filter((v) => {
    if (v.custom) return custom[v.custom]
    return true
  })

  $: infoType = {
    name: 'currentType',
    annotation: {
      label: el.choice.annotation?.label ?? '',
      aux: el.choice.annotation?.aux ?? '',
      itens: [
        ...(el.optional ? ['Não informar'] : []),
        ...elements.map((v) => v.annotation.label),
      ],
    },
    restriction: {
      enumeration: [
        ...(el.optional ? ['/-1'] : []),
        ...elements.map((_, i) => `/${i}`),
      ],
    },
  }

  let iRoot = el.name ? (root[el.name] = root[el.name] ?? {}) : root

  const initialIndex = elements.findIndex((v) => {
    return v.name
      ? !!iRoot[v.name]
      : v.element.every((k: any) => {
          if (iRoot[k.name]) {
            const curEnum = k.restriction?.enumeration
            return curEnum
              ? typeof curEnum == 'string'
                ? curEnum == iRoot[k.name]
                : curEnum.includes(iRoot[k.name])
              : true
          }
          return !!k.optional
        })
  })
  let params = {
    currentType:
      initialIndex != -1 ? initialIndex.toString() : el.optional ? '-1' : '0',
  }

  $: currentIndex = +params.currentType

  let lastIndex = -1
  $: {
    if (currentIndex != lastIndex && lastIndex != -1) {
      if (el.name) {
        root[el.name] = typeof root[el.name] == 'object' ? {} : ''
      } else {
        const lastEl = elements[lastIndex]
        if (lastEl.name) {
          root[lastEl.name] = typeof root[lastEl.name] == 'object' ? {} : ''
        } else
          lastEl.element.forEach(
            (v) => (root[v.name] = typeof root[v.name] == 'object' ? {} : '')
          )
      }
    }
    root = root
    lastIndex = currentIndex
  }

  $: cRoot = el.name ? (root[el.name] = root[el.name] ?? {}) : root
</script>

<Select bind:root={params} el={infoType} />
{#if currentIndex != -1}
  {#each elements as elChild, i (elChild)}
    {#if i == currentIndex}
      {#if elChild.element}
        <Elements root={cRoot} {level} el={elChild} />
      {:else}
        <AutoForm root={cRoot} {level} el={elChild} />
      {/if}
    {/if}
  {/each}
{/if}
