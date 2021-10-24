<script lang="ts">
  import { pattern } from '../code/patterns'

  export let med: any
</script>

<h3>Medicamento</h3>
<label>
  Registro ANVISA
  <input
    pattern={'[0-9]{13}|ISENTO'}
    bind:value={med.cProdANVISA}
    required
    title="Usar 'ISENTO' no caso de medicamento isento de registro na ANVISA"
  />
</label>
{#if med['cProdANVISA'] == 'ISENTO'}
  <label>
    Motivo da isenção
    <input
      maxlength="255"
      bind:value={med.xMotivoIsencao}
      required
      {pattern}
      title="Número da decisão que isenta registro"
    />
  </label>
{/if}
<label>
  Preço máximo ao consumidor
  <input type="number" step="0.01" bind:value={med.vPMC} required />
</label>
<br />
