<script lang="ts">
  import AutoForm from '../AutoForm.svelte'
  import Choice from './Choice.svelte'
  import Elements from './Elements.svelte'

  export let el: any
  export let root: any
  export let level: number = 3

  let showIndex = -1

  let elements = (root[el.name] ?? (root[el.name] = [])).map(v => {
    const orig = {}
    orig[el.name] = v
    return orig
  })
  $: root[el.name] = elements.map(v => v[el.name])

  function criar() {
    showIndex = elements.push({}) - 1
  }

  function remover(i: number) {
    elements.splice(i, 1)
    showIndex = -1
  }

  // Usado para não alterar o valor original
  const cloneEl = { ...el }
  delete cloneEl['maxOccurs']
  delete cloneEl['optional']
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

<div class="buttons">
  {#each elements as childRoot, i (childRoot)}
    <button class="button" on:click={() => (showIndex = i)}>Item</button>
    <div class="modal" class:is-active={showIndex == i}>
      <div class="modal-background" />
      <div class="modal-content">
        <div class="container content box">
          <form
            method="dialog"
            on:submit|preventDefault={() => {
              elements = elements
              showIndex = -1
            }}
          >
            {#if el.element}
              <Elements el={cloneEl} {level} root={childRoot} />
            {:else if el.choice}
              <Choice el={cloneEl} {level} root={childRoot} />
            {:else}
              <AutoForm el={cloneEl} {level} root={childRoot} />
            {/if}
            <div class="buttons is-centered">
              <button class="button is-primary">Salvar</button>
              <button class="button is-danger" on:click={() => remover(i)}
                >Remover</button
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  {/each}
</div>
