<script lang="ts">
  import AutoForm from '../AutoForm.svelte'

  export let level: number
  export let elements: any[]
  export let childRoot: any

  /*$: {
    const entries = Object.entries(childRoot)
    entries.forEach(v => {
      if (!elements.some(k => k.name == v[0])) {
        delete childRoot[v[0]]
      }
    })
  }*/

  function getSpecificReadonly(elements: any[]) {
    const _munsUFs = ['xMun', 'cMun', 'cMunFG', 'cUF', 'UF']
    const munsUFs = elements
      .filter((v) => _munsUFs.includes(v.name))
      .filter((v) => {
        const enumeration = v.restriction?.enumeration
        return !enumeration || typeof enumeration != 'string'
      })
      .sort((a, b) =>
        _munsUFs.indexOf(a.name) > _munsUFs.indexOf(b.name) ? 1 : -1
      )
    const _paises = ['cPais', 'xPais']
    const paises = elements
      .filter((v) => _paises.includes(v.name))
      .filter((v) => {
        const enumeration = v.restriction?.enumeration
        return !enumeration || typeof enumeration != 'string'
      })
      .sort((a, b) =>
        _paises.indexOf(a.name) > _paises.indexOf(b.name) ? 1 : -1
      )
    const hasmunsUFs = munsUFs.length > 0
    const hasPaises = paises.length > 0
    if (hasmunsUFs && hasPaises) {
      throw new Error('Paises e municipios habilitados ao mesmo tempo')
    } else if (hasmunsUFs || hasPaises) {
      const itens = hasmunsUFs ? munsUFs : paises
      return itens.reduce(
        (p, c, i) => {
          p[c.name] = i === 0 ? ' ' : ''
          return p
        },
        { specific: itens[0].name }
      )
    }
    return undefined
  }

  $: specificReadonly = getSpecificReadonly(elements)
</script>

{#each elements as childEl}
  <AutoForm
    el={childEl}
    root={childRoot}
    {level}
    bind:specificReadonly
  />
{/each}