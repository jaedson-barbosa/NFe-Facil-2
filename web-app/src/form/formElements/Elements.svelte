<script lang="ts">
  import AutoForm from '../AutoForm.svelte'

  export let level: number
  export let root: any
  export let el: any

  function getSpecificReadonly(elements: any[]): string[] {
    const _munsUFs = ['xMun', 'cMun', 'cMunFG', 'cUF', 'UF']
    const munsUFs = _munsUFs.filter((v) =>
      elements.some((k) => {
        const enumeration = k.restriction?.enumeration
        return k.name == v && typeof enumeration != 'string'
      })
    )
    const _paises = ['cPais', 'xPais']
    const paises = _paises.filter((v) =>
      elements.some((k) => {
        const enumeration = k.restriction?.enumeration
        return k.name == v && typeof enumeration != 'string'
      })
    )
    if (munsUFs.length && paises.length) {
      throw new Error('Paises e municipios habilitados ao mesmo tempo')
    }
    return [...munsUFs, ...paises]
  }

  let showElements = !el.optional || (el.name && root[el.name])

  $: specificReadonly = getSpecificReadonly(el.element)
  let childRoot = el.name
    ? typeof root[el.name] == 'object'
      ? root[el.name]
      : (root[el.name] = {})
    : root
</script>

{#if el.optional}
  <div class="field is-horizontal">
    <div class="field-label" />
    <div class="field-body">
      <div class="field">
        <label class="checkbox">
          <input type="checkbox" bind:checked={showElements} />
          Informar campo opcional
        </label>
      </div>
    </div>
  </div>
{/if}
{#if showElements}
  {#each el.element as childEl}
    <AutoForm el={childEl} bind:root={childRoot} {level} {specificReadonly} />
  {/each}
{/if}
