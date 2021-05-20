<script lang="ts">
  import { onDestroy } from 'svelte';
  import AutoForm from '../AutoForm.svelte'

  export let level: number
  export let root: any
  export let el: any

  /*$: {
    const entries = Object.entries(childRoot)
    entries.forEach(v => {
      if (!elements.some(k => k.name == v[0])) {
        delete childRoot[v[0]]
      }
    })
  }*/

  function getSpecificReadonly(elements: any[]): string[] {
    const _munsUFs = ['xMun', 'cMun', 'cMunFG', 'cUF', 'UF']
    const munsUFs = _munsUFs.filter(v => elements.some(k => {
      const enumeration = k.restriction?.enumeration
      return k.name == v && typeof enumeration != 'string'
    }))
    const _paises = ['cPais', 'xPais']
    const paises = _paises.filter(v => elements.some(k => {
      const enumeration = k.restriction?.enumeration
      return k.name == v && typeof enumeration != 'string'
    }))
    if (munsUFs.length && paises.length) {
      throw new Error('Paises e municipios habilitados ao mesmo tempo')
    } return [...munsUFs, ...paises]
  }

  $: specificReadonly = getSpecificReadonly(el.element)
  let childRoot = el.name ? root[el.name] ?? (root[el.name] = {}) : root

  onDestroy(() => {
    if (el.name) delete root[el.name]
  })
</script>

{#each el.element as childEl}
  <AutoForm
    el={childEl}
    bind:root={childRoot}
    {level}
    {specificReadonly}
  />
{/each}