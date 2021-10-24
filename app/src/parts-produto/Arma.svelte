<script lang="ts">
  import { pattern } from '../code/patterns'

  export let arma: any
</script>

<h3>Armamento</h3>
<label>
  Armamento de uso restrito
  <select bind:value={arma.tpArma}>
    <option value="0">Não</option>
    <option value="1">Sim</option>
  </select>
</label>
<label>
  Número de série da arma
  <input maxlength="15" bind:value={arma.nSerie} required {pattern} />
</label>
<label>
  Número de série do cano
  <input maxlength="15" bind:value={arma.nCano} required {pattern} />
</label>
<label>
  Descrição completa da arma
  <input
    maxlength="256"
    bind:value={arma.descr}
    required
    {pattern}
    title="Calibre, marca, capacidade, tipo de funcionamento, comprimento..."
  />
</label>
