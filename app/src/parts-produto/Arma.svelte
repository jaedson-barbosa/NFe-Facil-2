<script lang="ts">
  import { onDestroy } from 'svelte'
  import { pattern } from '../code/patterns'

  export let raiz: any
  if (!raiz.arma) raiz.arma = {}
  onDestroy(() => (raiz.arma = undefined))

  let usoRestrito = raiz.arma.tpArma == '1'
  $: raiz.arma.tpArma = usoRestrito ? '1' : '0'
</script>

<h3>Armamento</h3>
<label>
  <input type="checkbox" bind:checked={usoRestrito} />
  Armamento de uso restrito
</label>
<label>
  Número de série da arma
  <input maxlength="15" bind:value={raiz.arma.nSerie} required {pattern} />
</label>
<label>
  Número de série do cano
  <input maxlength="15" bind:value={raiz.arma.nCano} required {pattern} />
</label>
<label>
  Descrição completa da arma
  <small>
    Compreendendo: calibre, marca, capacidade, tipo de funcionamento,
    comprimento e demais elementos que permitam a sua perfeita identificação
  </small>
  <input maxlength="256" bind:value={raiz.arma.descr} required {pattern} />
</label>
