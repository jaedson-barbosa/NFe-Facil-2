<script lang="ts">
  import AutoForm from './AutoForm.svelte'

  export let level: number
  export let root: any
  export let el: any

  const elements = el.element as any[]

  function getSpecificReadonly(): string[] {
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

  const specificReadonly = getSpecificReadonly()

  function getShow(root: any): boolean {
    if (!el.optional) {
      if (el.name && !root[el.name]) {
        root[el.name] = {}
      }
      return true
    } else {
      if (el.name) {
        return root[el.name]
      }
      return el.element.some(v => v.name && root[v.name])
    }
  }
  $: showElements = getShow(root)

  function getIfUndefined(childEl: any, childRoot: any) {
    const result =
      !childEl.ifUndefined ||
      !childRoot[childEl.ifUndefined] ||
      !Object.keys(childRoot[childEl.ifUndefined]).length
    if (childEl.name && !result) {
      childRoot[childEl.name] =
        typeof childRoot[childEl.name] == 'string' ? '' : {}
    }
    return result
  }
</script>

{#if showElements}
  {#if el.optional}
    <div class="field is-horizontal">
      <div class="field-label" />
      <div class="field-body">
        <div class="field">
          <button
            type="button"
            class="button"
            on:click={() => (root[el.name] = '')}
          >
            Remover campo opcional
          </button>
        </div>
      </div>
    </div>
  {/if}
  {#each elements as childEl}
    {#if getIfUndefined(childEl, root[el.name] ?? root)}
      {#if el.name}
        <AutoForm
          el={childEl}
          bind:root={root[el.name]}
          {level}
          {specificReadonly}
        />
      {:else}
        <AutoForm el={childEl} bind:root {level} {specificReadonly} />
      {/if}
    {/if}
  {/each}
{:else if el.optional}
  <div class="field is-horizontal">
    <div class="field-label" />
    <div class="field-body">
      <div class="field">
        <button
          type="button"
          class="button"
          on:click={() => (root[el.name] = {})}
        >
          Informar campo opcional
        </button>
      </div>
    </div>
  </div>
{/if}
