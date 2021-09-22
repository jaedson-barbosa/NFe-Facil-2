<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'

  export let raiz: any
</script>

<h4>Armamento</h4>
<Select
  name="tpArma"
  {raiz}
  lab="Tipo de arma de fogo"
  els={[
    ['0', 'Uso permitido'],
    ['1', 'Uso restrito'],
  ]}
/>
<InputT name="nSerie" {raiz} lab="Número de série da arma" min={1} max={15} />
<InputT name="nCano" {raiz} lab="Número de série do cano" min={1} max={15} />
<InputT
  name="descr"
  {raiz}
  lab="Descrição completa da arma"
  aux="Compreendendo: calibre, marca, capacidade, tipo de funcionamento, comprimento e demais elementos que permitam a sua perfeita identificação"
  min={1}
  max={256}
/>
