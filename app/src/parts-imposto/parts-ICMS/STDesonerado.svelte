<script lang="ts">
  export let ICMS: any

  $: {
    if (!ICMS['vICMSSTDeson'] && ICMS['motDesICMSST']) ICMS['motDesICMSST'] = ''
  }
</script>

<h4>ICMS desonerado</h4>
<label>
  <i>Valor do ICMS ST desonerado</i>
  <input type="number" step="0.01" bind:value={ICMS['vICMSSTDeson']} />
</label>
{#if ICMS['vICMSSTDeson']}
  <label>
    Motivo da desoneração
    <select bind:value={ICMS['motDesICMSST']} required>
      <option value="3">3 - Uso na agropecuária</option>
      <option value="9">9 - Outros</option>
      <option value="12">
        12 - Órgão de fomento e desenvolvimento agropecuário
      </option>
    </select>
  </label>
{/if}
<br />
