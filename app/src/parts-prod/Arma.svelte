<script lang="ts">
  import { onDestroy } from 'svelte'
  import InputT from '../components/InputT.svelte'

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
<InputT
  bind:val={raiz.arma.nSerie}
  lab="Número de série da arma"
  min={1}
  max={15}
/>
<InputT
  bind:val={raiz.arma.nCano}
  lab="Número de série do cano"
  min={1}
  max={15}
/>
<InputT
  bind:val={raiz.arma.descr}
  lab="Descrição completa da arma"
  aux="Compreendendo: calibre, marca, capacidade, tipo de funcionamento, comprimento e demais elementos que permitam a sua perfeita identificação"
  min={1}
  max={256}
/>
