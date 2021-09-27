<script lang="ts">
  export let ICMS: any
  export let pSTRequired: boolean

  $: {
    if (!ICMS['vBCSTRet']) {
      delete ICMS['pST']
      delete ICMS['vICMSSTRet']
      delete ICMS['vICMSSubstituto']
    }
  }
</script>

<h4>ICMS cobrado anteriormente por ST</h4>
<label>
  <i>Base de cálculo</i>
  <input type="number" step="0.01" bind:value={ICMS['vBCSTRet']} />
</label>
{#if ICMS['vBCSTRet']}
  <label>
    {#if pSTRequired}
      Aliquota suportada pelo consumidor final
    {:else}
      <i>Aliquota suportada pelo consumidor final</i>
    {/if}
    <small>
      Alíquota do cálculo do ICMS-ST já incluso o FCP caso incida sobre a
      mercadoria
    </small>
    <input
      type="number"
      step="0.0001"
      bind:value={ICMS['pST']}
      required={pSTRequired}
    />
  </label>
  <label>
    <i>ICMS próprio do substituto cobrado anteriormente</i>
    <input type="number" step="0.01" bind:value={ICMS['vICMSSubstituto']} />
  </label>
  <label>
    ICMS ST cobrado anteriormente
    <input type="number" step="0.01" bind:value={ICMS['vICMSSTRet']} required />
  </label>
{/if}
<br />
