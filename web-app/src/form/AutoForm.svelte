<script lang="ts">
  export let el: any
  export let root: any
  export let level: number = 3
  export let specificReadonly: string[] = []

  import { complexType, simpleType } from './data/nfe.json'
  import Readonly from './formElements/Readonly.svelte'
  import Select from './formElements/Select.svelte'
  import Specific from './formElements/Specific.svelte'
  import Input from './formElements/Input.svelte'
  import Choice from './formElements/Choice.svelte'
  import Elements from './formElements/Elements.svelte'

  $: {
    if (!el.choice && !el.element) {
      const findType = (v: any) => v.name == el.type
      if (!el.restriction) {
        el.restriction = simpleType.find(findType)?.restriction
      }
      if (!el.restriction) {
        el.element = complexType.find(findType).element
      }
    }
  }

  $: isConstant = typeof el.restriction?.enumeration == 'string'
  $: specificIndex = specificReadonly.indexOf(el.name)
</script>

{#if isConstant || specificIndex > 0}
  <Readonly {el} {root} />
{:else if el.choice || el.element}
  <div class="container content box">
    <div class="field is-horizontal">
      <div class="field-label" />
      <div class="field-body">
        <div class="field">
          <h1 class="title is-{level}">{el.annotation?.label}</h1>
          {#if el.annotation?.aux}
            <h1 class="subtitle is-{level + 2}">{el.annotation?.aux}</h1>
          {/if}
        </div>
      </div>
    </div>
    {#if el.element}
      <Elements {el} level={level + 1} bind:root />
    {:else}
      <Choice {el} level={level + 1} bind:root />
    {/if}
    <slot />
  </div>
{:else if root}
  {#if specificIndex == 0}
    <Specific bind:root bind:specificReadonly {el} />
  {:else if el.restriction?.enumeration}
    <Select bind:root {el} />
  {:else}
    <Input bind:root {el} />
  {/if}
{/if}
