<script lang="ts">
  export let name: string
  export let raiz: any
  export let newItem: () => any = () => {}

  $: itens = raiz[name] as any[]

  if (!raiz[name]) raiz[name] = []
  let exibirDetalhes = -1

  function adicionarItem() {
    const newList = [newItem(), ...itens]
    raiz[name] = newList
    exibirDetalhes = newList.length - 1
  }

  function removerItem(i: number) {
    itens.splice(i, 1)
    raiz[name] = itens
  }
</script>

<button type="button" on:click={adicionarItem}> Adicionar item </button>
{#each itens as item, i}
  <details open={exibirDetalhes == i}>
    <summary> <slot name="h" {item} /> </summary>
    <slot name="b" {item} />
    <button on:click={() => removerItem(i)}> Remover item </button>
  </details>
{/each}
