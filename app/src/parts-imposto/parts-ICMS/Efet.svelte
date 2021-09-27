<script lang="ts">
  export let ICMS: any

  $: {
    if (!ICMS['pRedBCEfet']) {
      delete ICMS['vBCEfet']
      delete ICMS['pICMSEfet']
      delete ICMS['vICMSEfet']
    }
  }
</script>

<h4>ICMS efetivo</h4>
<label>
  Percentual de redução da BC efetiva
  <input type="number" step="0.0001" bind:value={ICMS['pRedBCEfet']} />
</label>
{#if ICMS['pRedBCEfet']}
  <label>
    Base de cálculo
    <input type="number" step="0.01" bind:value={ICMS['vBCEfet']} required />
  </label>
  <label>
    Alíquota
    <input type="number" step="0.0001" bind:value={ICMS['pICMSEfet']} required />
  </label>
  <label>
    Valor
    <input type="number" step="0.01" bind:value={ICMS['vICMSEfet']} required />
  </label>
{/if}
<br />
