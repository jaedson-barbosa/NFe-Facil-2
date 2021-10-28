<script lang="ts">
  import { pattern } from '../code/patterns'

  export let raiz: any
</script>

<tr>
  <td>
    <input bind:value={raiz.nLote} minlength="1" maxlength="20" {pattern} />
  </td>
  <td>
    <input type="number" step="0.001" bind:value={raiz.qLote} />
  </td>
  <td>
    <input type="date" bind:value={raiz.dFab} />
  </td>
  <td>
    <input type="date" bind:value={raiz.dVal} />
  </td>
  <td>
    <input bind:value={raiz.cAgreg} maxlength="20" {pattern} />
  </td>
</tr>
