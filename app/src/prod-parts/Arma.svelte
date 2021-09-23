<script lang="ts">
  import { onDestroy } from 'svelte'
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'

  export let raiz: any
  if (!raiz.arma) raiz.arma = {}
  onDestroy(() => (raiz.arma = undefined))
</script>

<h3>Armamento</h3>
<Select
  bind:val={raiz.arma.tpArma}
  lab="Tipo de arma de fogo"
  els={[
    ['0', 'Uso permitido'],
    ['1', 'Uso restrito'],
  ]}
/>
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
