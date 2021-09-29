<script lang="ts">
  export let ICMS: any
</script>

<h4>ICMS ST da UF destino</h4>
<label>
  Base de cálculo
  <input type="number" step="0.01" bind:value={ICMS['vBCSTDest']} required />
</label>
<label>
  Valor
  <input type="number" step="0.01" bind:value={ICMS['vICMSSTDest']} required />
</label>
<br />
