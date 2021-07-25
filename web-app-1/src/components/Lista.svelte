<script lang="ts">
  export let name: string
  export let raiz: any

  $: itens = raiz[name] as any[]

  if (!raiz[name]) raiz[name] = []
  let exibirDetalhes = -1

  function adicionarItem() {
    const newList = [undefined, ...itens]
    raiz[name] = newList
    exibirDetalhes = newList.length - 1
  }

  function removerItem(i: number) {
    itens.splice(i, 1)
    raiz[name] = itens
  }
</script>

<slot name="header" />
<button on:click={adicionarItem}> Adicionar item </button>
{#each itens as item, i}
  <details open={exibirDetalhes == i}>
    <summary> <slot name="summary" {item} /> </summary>
    <slot name="body" {i} />
    <button on:click={() => removerItem(i)}> Remover item </button>
  </details>
{/each}
