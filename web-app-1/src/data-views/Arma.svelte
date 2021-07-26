<script lang="ts">
  import InputT from "../components/InputT.svelte";
  import Select from "../components/Select.svelte";
  import Opcional from "../components/Opcional.svelte";

  export let raiz: any;

  const el = "arma";
  if (!raiz[el]) raiz[el] = {};
  $: r = raiz[el];
</script>

<h5>Armamento</h5>
<Opcional {raiz} name={el}>
  <Select
    bind:val={r["tpArma"]}
    lab="Tipo de arma de fogo"
    els={[
      ["0", "Uso permitido"],
      ["1", "Uso restrito"],
    ]}
  />
  <InputT
    bind:val={r["nSerie"]}
    lab="Número de série da arma"
    min={1}
    max={15}
  />
  <InputT
    bind:val={r["nCano"]}
    lab="Número de série do cano"
    min={1}
    max={15}
  />
  <InputT
    bind:val={r["descr"]}
    lab="Descrição completa da arma"
    aux="Compreendendo: calibre, marca, capacidade, tipo de funcionamento, comprimento e demais elementos que permitam a sua perfeita identificação"
    min={1}
    max={256}
  />
</Opcional>
