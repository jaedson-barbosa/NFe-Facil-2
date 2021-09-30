<script lang="ts">
  import { onDestroy } from 'svelte'

  export let raiz: any
  onDestroy(() => (raiz.nRECOPI = ''))
</script>

<label>
  Número do RECOPI
  <input type="number" step="1" bind:value={raiz['nRECOPI']} required />
</label>
