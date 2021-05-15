<script lang="ts">
  export let el: any
  export let root: any

  import { complexType, simpleType } from './data/nfe.json'
  import Select from './formElements/Select.svelte'
  import Input from './formElements/Input.svelte'

  $: restriction = (() => {
    if (!el.choice && !el.element) {
      const restriction = el.restriction ?? simpleType.find((v: any) => v.name == el.type)?.restriction
      if (!restriction) {
        el.element = complexType.find((v: any) => v.name == el.type).element
      }
      return restriction
    }
  })()
  $: annotation = el.annotation
  $: enumeration = restriction?.enumeration
  $: type =
    el.name == 'fone'
      ? 'tel'
      : el.name == 'email'
      ? 'email'
      : el.type == 'TData'
      ? 'date'
      : !/[a-zA-Z]|ÿ/.test(restriction?.pattern)
      ? 'number'
      : 'text'
    $: childRoot = getNewRoot()
    function getNewRoot() {
      if (!root) return undefined
      if (el.element) {
        return root[el.name] = {}
      } else return root[el.name] = ''
    }
</script>

{@debug root}

{#if el.element}
  {#each el.element as el}
    <svelte:self {el} root={childRoot} />
  {/each}
{:else if enumeration && root}
  <Select bind:value={root[el.name]} {annotation} {enumeration} />
{:else if root}
  <Input bind:value={root[el.name]} {type} {restriction} {annotation} />
{/if}
