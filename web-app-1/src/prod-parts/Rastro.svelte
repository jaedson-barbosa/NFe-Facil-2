<script lang="ts">
  export let raiz: any
</script>

<tr>
  <td>
    <input bind:value={raiz.nLote} min="1" max="20" />
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
    <input bind:value={raiz.cAgreg} pattern={'[0-9]{1,20}'} />
  </td>
</tr>
