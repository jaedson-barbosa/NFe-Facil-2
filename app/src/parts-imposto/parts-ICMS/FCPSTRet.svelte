<script lang="ts">
  export let ICMS: any

  $: {
    if (!ICMS['vBCFCPSTRet']) {
      delete ICMS['pFCPSTRet']
      delete ICMS['vFCPSTRet']
    }
  }
</script>

<h4>FCP retido anteriormente por ST</h4>
<label>
  Base de cálculo
  <input type="number" step="0.01" bind:value={ICMS['vBCFCPSTRet']} />
</label>
{#if ICMS['vBCFCPSTRet']}
  <label>
    Percentual
    <input type="number" step="0.0001" bind:value={ICMS['pFCPSTRet']} required />
  </label>
  <label>
    Valor
    <input type="number" step="0.01" bind:value={ICMS['vFCPSTRet']} required />
  </label>
{/if}
<br />