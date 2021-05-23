<script lang="ts">
  import AutoForm from '../AutoForm.svelte'
  import Choice from './Choice.svelte'
  import Elements from './Elements.svelte'

  export let el: any
  export let root: any
  export let level: number = 3

  //const max = el.maxOccurs
  let cIndex = -1
  let cRoot = {}

  let showModal = false

  $: elements = (root[el.name] as any[]) ?? (root[el.name] = [])
  async function criar() {
    cIndex = -1
    cRoot = {}
    showModal = true
  }

  function salvar() {
    elements.push(cRoot)
    root = root
    showModal = false
  }

  // Usado para não alterar o valor original
  const cloneEl = { ...el }
  delete cloneEl['maxOccurs']
  delete cloneEl['optional']

  // Corrigir problemas no modal pra cada item
</script>

<div class="field is-horizontal">
  <div class="field-label is-normal" />
  <div class="field-body">
    <div class="field">
      <div class="control">
        <button class="button" type="button" on:click={criar}>
          Adicionar
        </button>
      </div>
    </div>
  </div>
</div>

{#each elements as childRoot, i}
<div class="modal" class:is-active={showModal}>
  <div class="modal-background" />
  <div class="modal-content">
    <div class="container content box">
      <form method="dialog" on:submit|preventDefault={salvar}>
        {#if el.element}
          <Elements el={cloneEl} {level} root={childRoot} />
        {:else if el.choice}
          <Choice el={cloneEl} {level} root={childRoot} />
        {:else}
          <AutoForm el={cloneEl} {level} root={childRoot} />
        {/if}
        <div class="buttons is-centered">
          <button class="button is-primary">Salvar</button>
          <button
            type="button"
            class="button is-danger"
            on:click={() => remover(i)}>Cancelar</button
          >
        </div>
      </form>
    </div>
  </div>
</div>
{/each}

{elements.length}
