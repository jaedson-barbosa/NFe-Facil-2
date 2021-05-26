<script lang="ts">
  export let el: any
  export let root: any
  export let level: number = 3
  export let specificReadonly: string[] = []

  import { complexType, simpleType } from './data/nfe.json'
  import Readonly from './Readonly.svelte'
  import Select from './Select.svelte'
  import Specific from './Specific.svelte'
  import Input from './Input.svelte'
  import Choice from './Choice.svelte'
  import Elements from './Elements.svelte'
  import List from './List.svelte'
  import Container from './Container.svelte'

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

{#if isConstant || specificIndex > 0 || el.readonly}
  <Readonly {el} {root} />
{:else if el.choice || el.element || el.maxOccurs > 1}
  <Container {level} label={el.annotation?.label} aux={el.annotation?.aux}>
    {#if el.maxOccurs > 1}
      <List {el} level={level + 1} bind:root />
    {:else if el.element}
      <Elements {el} level={level + 1} bind:root />
    {:else}
      <Choice {el} level={level + 1} bind:root />
    {/if}
    <slot />
  </Container>
{:else if root}
  {#if specificIndex == 0}
    <Specific bind:root bind:specificReadonly {el} />
  {:else if el.restriction?.enumeration}
    <Select bind:root {el} />
  {:else}
    <Input bind:root {el} />
  {/if}
{/if}
