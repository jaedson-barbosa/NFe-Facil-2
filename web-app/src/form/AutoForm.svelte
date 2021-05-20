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
  import Choice from './formElements/Choice.svelte'
  import Elements from './formElements/Elements.svelte'

  $: childRoot = getNewRoot(el, root)
  function getNewRoot(el: any, root: any) {
    if (!el.choice && !el.element) {
      const findType = (v: any) => v.name == el.type
      if (!el.restriction) {
        el.restriction = simpleType.find(findType)?.restriction
      }
      if (!el.restriction) {
        el.element = complexType.find(findType).element
      }
    }
    if (el.element || el.choice) {
      if (el.name) {
        const child = root[el.name] ?? {}
        return (root[el.name] = child)
      } else return root
    }
    root[el.name] = root[el.name] ?? ''
    return root
  }

  $: ({ aux, label } = el.annotation)
  let showElements = !el.optional

  $: name = el.name
  $: isConstant = typeof el.restriction?.enumeration == 'string'
  $: isPassiveSpecific =
    specificReadonly &&
    name in specificReadonly &&
    specificReadonly.specific != name
  $: {
    if (isConstant) {
      root[name] = el.restriction?.enumeration
    } else if (isPassiveSpecific) {
      root[name] = specificReadonly[name]
    }
  }
</script>

{#if isConstant || isPassiveSpecific}
  <Readonly {el} value={root[el.name]} />
{:else if el.choice || el.element}
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
      {#if el.element}
        <Elements {childRoot} elements={el.element} level={level + 1} />
      {:else}
        <Choice {childRoot} choice={el.choice} level={level + 1} />
      {/if}
    {/if}
    <slot />
  </div>
{:else if root}
  {#if specificReadonly && specificReadonly[el.name]}
    <Specific {root} bind:specificReadonly {el} />
  {:else if el.restriction?.enumeration}
    <Select {root} {el} />
  {:else}
    <Input {root} {el} />
  {/if}
{/if}
