<script lang="ts">
  import { goto } from '@roxi/routify'

  export let raiz: any
  export let index: number

  $: prod = raiz.det[index].prod
</script>

<tr
  class="clicavel"
  on:click={() => $goto('/:produto', { produto: index.toString() })}
>
  <td>{prod.cProd}</td>
  <td>{prod.xProd}</td>
  <td>
    <input
      type="number"
      step="0.0001"
      min="0"
      on:click|stopPropagation
      bind:value={prod.qCom}
    />
  </td>
  <td>{prod.vProd}</td>
</tr>