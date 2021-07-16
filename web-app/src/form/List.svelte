<script lang="ts">
  import AutoForm from './AutoForm.svelte'
  import Choice from './Choice.svelte'
  import Elements from './Elements.svelte'

  export let el: any
  export let root: any
  export let level: number = 3

  let showIndex = -1

  function getRoot(v: any) {
    const orig = {}
    orig[el.name] = v
    return orig
  }

  $: elements = Array.isArray(root[el.name])
    ? root[el.name]
    : root[el.name]
    ? [root[el.name]]
    : []

  //Fazer alteração direto na root e tornar o elements reativo (inverter o que tem agora)
  function criar(newEl: any = {}) {
    root[el.name] = [...root[el.name], newEl[el.name] ?? newEl]
    showIndex = root[el.name].length - 1
  }

  function remover(i: number) {
    root[el.name].splice(i, 1)
    root = root
  }

  // Usado para não alterar o valor original
  const cloneEl = { ...el }
  delete cloneEl['maxOccurs']
  delete cloneEl['optional']
</script>

<slot name="header" {criar}>
  <button type="button" on:click={criar}> Adicionar </button>
</slot>

{#each elements as childRoot, i (childRoot)}
  <button type="button" on:click={() => (showIndex = i)}>
    Item
  </button>
  <dialog open={showIndex == i}>
    <form
      method="dialog"
      on:submit|preventDefault={() => {
        showIndex = -1
        root = root
      }}
    >
      {#if el.choice}
        <Choice el={cloneEl} {level} root={getRoot(childRoot)} />
      {:else if el.element}
        <Elements el={cloneEl} {level} root={getRoot(childRoot)} />
      {:else}
        <AutoForm el={cloneEl} {level} root={getRoot(childRoot)} />
      {/if}
      <div class="clearfix">
        <button class="float-left">Salvar</button>
        <button class="float-right" on:click={() => remover(i)}>
          Remover
        </button>
      </div>
    </form>
  </dialog>
{/each}
