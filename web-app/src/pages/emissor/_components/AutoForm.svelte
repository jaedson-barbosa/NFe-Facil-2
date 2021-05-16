<script lang="ts">
  export let el: any
  export let root: any
  export let level: number = 3
  export let specificReadonly: any

  import { complexType, simpleType } from './data/nfe.json'
  import Readonly from './formElements/Readonly.svelte'
  import Select from './formElements/Select.svelte'
  import Specific from './formElements/Specific.svelte'
  import Input from './formElements/Input.svelte'

  let childSpecificReadonly: any
  const childRoot = getNewRoot()
  function getNewRoot() {
    if (!root) return undefined
    let els = el.element as any[]
    if (!el.choice && !els) {
      const findType = (v: any) => v.name == el.type
      if (!el.restriction) {
        el.restriction = simpleType.find(findType)?.restriction
      }
      if (!el.restriction) {
        els = el.element = complexType.find(findType).element
      }
    }
    if (els) {
      const _munsUFs = ['xMun', 'cMun', 'cMunFG', 'cUF', 'UF']
      const munsUFs = els
        .filter((v) => _munsUFs.includes(v.name))
        .filter((v) => {
          const enumeration = v.restriction?.enumeration
          return !enumeration || typeof enumeration != 'string'
        })
        .sort((a, b) =>
          _munsUFs.indexOf(a.name) > _munsUFs.indexOf(b.name) ? 1 : -1
        )
      const _paises = ['cPais', 'xPais']
      const paises = els
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
        childSpecificReadonly = itens.reduce((p, c, i) => {
          p[c.name] = i === 0 ? ' ' : ''
          return p
        }, {})
        console.log(itens)
      }
      if (el.name) {
        const child = {}
        return (root[el.name] = child)
      } else return root
    }
    root[el.name] = ''
  }

  const { aux, label } = el.annotation
  let showElements = !el.optional
  
  const isConstant = typeof el.restriction?.enumeration == 'string'
  const isPassiveSpecific =
    specificReadonly &&
    el.name in specificReadonly &&
    !specificReadonly[el.name]
  $: {
    const name = el.name
    if (isConstant) {
      root[name] = el.restriction?.enumeration
    } else if(isPassiveSpecific) {
      root[name] = specificReadonly[name]
    }
  }
</script>

{#if isConstant || isPassiveSpecific}
  <Readonly {el} value={root[el.name]} />
{:else if el.element}
  <div class="container content box">
    <div class="field is-horizontal">
      <div class="field-label" />
      <div class="field-body">
        <div class="field">
          <h1 class="title is-{level}">{label}</h1>
          {#if aux}
            <h1 class="subtitle is-{level + 2}">{aux}</h1>
          {/if}
        </div>
      </div>
    </div>
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
        <svelte:self
          el={childEl}
          root={childRoot}
          level={level + 2}
          bind:specificReadonly={childSpecificReadonly}
        />
      {/each}
    {/if}
  </div>
{:else if root}
  {#if specificReadonly && specificReadonly[el.name]}
    <Specific bind:value={root[el.name]} bind:specificReadonly {el} />
  {:else if el.restriction?.enumeration}
    <Select bind:value={root[el.name]} {el} />
  {:else}
    <Input bind:value={root[el.name]} {el} />
  {/if}
{/if}
