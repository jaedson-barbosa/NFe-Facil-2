<script lang="ts">
  import { pattern } from '../code/patterns'

  export let arma: any

  let usoRestrito = arma.tpArma == '1'
  $: arma.tpArma = usoRestrito ? '1' : '0'
</script>

<h3>Armamento</h3>
<label>
  <input type="checkbox" bind:checked={usoRestrito} />
  Armamento de uso restrito
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
  <small>
    Compreendendo: calibre, marca, capacidade, tipo de funcionamento,
    comprimento e demais elementos que permitam a sua perfeita identificação
  </small>
  <input maxlength="256" bind:value={arma.descr} required {pattern} />
</label>
