<script lang="ts">
  import Voltar from '../components/Voltar.svelte'
  import {
    connectToPrinter,
    CutTypes,
    ImageModes,
  } from 'browser-thermal-printer-encoder'
  import { Fonts, Writer } from 'bdf-fonts'
  import { Impressao } from '../code/impressao-nfce'

  const fontes = Object.keys(Fonts)
    .flatMap((family) =>
      Fonts[family as keyof typeof Fonts]
        .map((k) => k.size)
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((size) => ({ familia: family, tamanho: size }))
    )
    .sort((a, b) => a.tamanho - b.tamanho)

  const impressao = new Impressao()
</script>

<h1><Voltar /> Definições de impressão</h1>
<h2>Impressão térmica de NFC-e</h2>
<label>
  Fonte
  <select bind:value={impressao.fonte} size="4">
    {#each fontes as fonte}
      <option value={fonte}>{fonte.familia} ({fonte.tamanho})</option>
    {/each}
  </select>
</label>
<label>
  <input type="checkbox" bind:checked={impressao.aumentada} />
  Dobrar tamanho da fonte
</label>
<label>
  Largura de impressão
  <select bind:value={impressao.largura} size="4">
    <option value={384}>58 mm (padrao)</option>
    <option value={576}>58 mm (alta qualidade)</option>
    <option value={576}>80 mm (padrao)</option>
    <option value={864}>80 mm (alta qualidade)</option>
  </select>
</label>

<label>
  Codificação da impressora
  <select bind:value={impressao.formato} size="2">
    <option value={ImageModes.raster}>Raster (mais antigo)</option>
    <option value={ImageModes.column}>Column (mais recente)</option>
  </select>
</label>
<small>
  Aviso: A maioria das impressoras só é compatível com apenas uma codificação!
</small>

<label>
  Corte
  <select bind:value={impressao.corte} size="3">
    <option value={CutTypes.none}>Sem corte</option>
    <option value={CutTypes.partial}>Parcial</option>
    <option value={CutTypes.full}>Completo</option>
  </select>
</label>

<label>
  Espaçamento superior
  <input
    type="range"
    min="0"
    max="3"
    step="1"
    bind:value={impressao.superior}
  />
</label>

<label>
  Espaçamento inferior
  <input
    type="range"
    min="0"
    max="3"
    step="1"
    bind:value={impressao.inferior}
  />
</label>

<label>
  Pulso
  <select bind:value={impressao.pinoPulso} size="3">
    <option value={-1}>Sem pulso</option>
    <option value={0}>No pino 0</option>
    <option value={1}>No pino 1</option>
  </select>
</label>

{#if impressao.pinoPulso !== -1}
  <label>
    Largura ligado/on (ms)
    <input
      type="range"
      min="50"
      max="500"
      step="2"
      bind:value={impressao.onPulso}
    />
  </label>
  <label>
    Largura desligado/off (ms)
    <input
      type="range"
      min="50"
      max="500"
      step="2"
      bind:value={impressao.offPulso}
    />
  </label>
{/if}

<button on:click={impressao.testarDefinicoes}>Testar impressão</button>

<hr />

<p>
  Para garantir máxima compatibildade com o maior número possível de impressoras
  térmicas, esta aplicação usa o mínimo possível de comandos de impressão e todo
  o layout de impressão é gerado pela própria aplicação e codificado usando o
  formato de codificação selecionado por você, para saber qual formato é usado
  por sua impressora a forma mais fácil é testar com um deles e, caso nada seja
  impresso, trocar para o outro.
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
