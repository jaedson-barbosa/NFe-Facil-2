<script lang="ts">
  import Voltar from '../components/Voltar.svelte'
  import {
    connectToPrinter,
    CutTypes,
    ImageModes,
  } from 'browser-thermal-printer-encoder'
  import { Fonts, Writer } from 'bdf-fonts'

  const fontes = Object.keys(Fonts)
    .flatMap((family) =>
      Fonts[family as keyof typeof Fonts]
        .map((k) => k.size)
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((size) => ({ family, size }))
    )
    .sort((a, b) => a.size - b.size)

  let fonte: { family: string; size: number }
  let aumentada: boolean
  let largura: number
  let formato: ImageModes
</script>

<h1><Voltar /> Definições de impressão</h1>
<h2>Impressão térmica de NFC-e</h2>
<label>
  Fonte
  <select bind:value={fonte}>
    {#each fontes as fonte}
      <option value={fonte}>{fonte.family} ({fonte.size})</option>
    {/each}
  </select>
</label>
<label>
  <input type="checkbox" bind:checked={aumentada} />
  Dobrar tamanho da fonte
</label>
<label>
  Largura de impressão
  <select bind:value={largura}>
    <option value={384}>58 mm (padrao)</option>
    <option value={576}>58 mm (alta qualidade)</option>
    <option value={576}>80 mm (padrao)</option>
    <option value={864}>80 mm (alta qualidade)</option>
  </select>
</label>

<label>
  Formato de codificação
  <select>
    <option value={ImageModes.raster}>Raster (mais antigo)</option>
    <option value={ImageModes.column}>Column (mais recente)</option>
  </select>
</label>

<label>
  Espaçamento superior
  <input />
</label>

<p>
  Para garantir máxima compatibildade com o maior número possível de impressoras
  térmicas, esta aplicação usa o mínimo possível de comandos de impressão e todo
  o layout de impressão é gerado pela própria aplicação e codificado usando o
  formato de codificação selecionado por você.
</p>
<p>
  Como a aplicação é responsável por montar o layout de impressão, temos aqui a
  possibilidade de escolher qual a fonte será utilizada. Sinta-se livre pra
  escolher qual a mais te agrada, sempre tomando cuidado para que a fonte
  selecionada não seja muito pequena, afinal o cliente deve poder ler o DANFE.
</p>
<p>
  Caso você tenha gostado de alguma fonte cuja impressão está muito pequena, é
  possível marcar a caixa "Dobrar tamanho da fonte" para que a fonte seja
  aumentada em 2 vezes e assim se torne mais legível.
</p>
<p>
  Em relação à largura de impressão, saber a largura da folha é fácil, afinal
  basta analisar a largura da bobina. Já em relação à qualidade, "padrão" se
  refere a impressoras de 203 dpi, que geralmente são aquelas mais baratas,
  enquanto "alta qualidade" se refere a impressoras de 304 dpi, que fornecem
  melhor qualidade de impressão mas a um custo mais elevado.
</p>
