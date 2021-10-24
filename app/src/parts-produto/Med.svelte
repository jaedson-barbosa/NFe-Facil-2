<script lang="ts">
  import { pattern } from '../code/patterns'

  export let med: any
</script>

<h3>Medicamento</h3>
<label>
  Registro ANVISA
  <small>
    Usar literal ISENTO no caso de medicamento isento de registro na ANVISA
  </small>
  <input pattern={'[0-9]{13}|ISENTO'} bind:value={med.cProdANVISA} required />
</label>
{#if med['cProdANVISA'] == 'ISENTO'}
  <label>
    Motivo da isenção
    <small>
      Para medicamento isento de registro na ANVISA, informar o número da
      decisão que o isenta
    </small>
    <input maxlength="255" bind:value={med.xMotivoIsencao} required {pattern} />
  </label>
{/if}
<label>
  Preço máximo ao consumidor
  <input type="number" step="0.01" bind:value={med.vPMC} required />
</label>
<br />
