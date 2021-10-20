<script lang="ts">
  import Voltar from '../components/Voltar.svelte'
  import { CutTypes, ImageModes } from 'browser-thermal-printer-encoder'
  import { Fonts } from 'bdf-fonts'
  import { Impressao } from '../code/impressao-nfce'

  const fontes = Object.entries(Fonts)
    .flatMap(([familia, v]) =>
      Object.keys(v)
        .map((k) => +k)
        .filter((v, i, a) => a.indexOf(v) === i)
        .flatMap((size) =>
          [1, 2].map((escala) => ({
            id: familia + '-' + size + '-' + escala,
            familia,
            tamanho: size * escala,
          }))
        )
    )
    .sort((a, b) => a.tamanho - b.tamanho)

  const impressao = new Impressao()
</script>

<h1><Voltar /> Definições de impressão</h1>
<h2>Impressão térmica de NFC-e</h2>

<div class="row">
  <div class="column">
    <label>
      Fonte
      <select bind:value={impressao.fonte}>
        {#each fontes as fonte (fonte.id)}
          <option value={fonte.id}>
            {fonte.familia} ({fonte.tamanho})
          </option>
        {/each}
      </select>
    </label>

    <label>
      Largura de impressão
      <select bind:value={impressao.largura}>
        <option value={384}>58 mm (padrao)</option>
        <option value={576}>58 mm (alta qualidade)</option>
        <option value={576}>80 mm (padrao)</option>
        <option value={864}>80 mm (alta qualidade)</option>
      </select>
    </label>

    <label>
      Codificação da impressora
      <select bind:value={impressao.formato}>
        <option value={ImageModes.raster}>Raster (mais antigo)</option>
        <option value={ImageModes.column}>Column (mais recente)</option>
      </select>
    </label>

    <label>
      Corte
      <select bind:value={impressao.corte}>
        <option value={CutTypes.none}>Sem corte</option>
        <option value={CutTypes.partial}>Parcial</option>
        <option value={CutTypes.full}>Completo</option>
      </select>
    </label>
  </div>
  <div class="column">
    <label>
      Espaçamento superior
      <select bind:value={impressao.superior}>
        <option value={0}>Sem espaçamento</option>
        <option value={1}>Uma linha</option>
        <option value={2}>Duas linhas</option>
        <option value={3}>Três linhas</option>
      </select>
    </label>

    <label>
      Espaçamento inferior
      <select bind:value={impressao.inferior}>
        <option value={0}>Sem espaçamento</option>
        <option value={1}>Uma linha</option>
        <option value={2}>Duas linhas</option>
        <option value={3}>Três linhas</option>
      </select>
    </label>

    <label>
      Pulso
      <select bind:value={impressao.pinoPulso}>
        <option value={-1}>Sem pulso</option>
        <option value={0}>No pino 0</option>
        <option value={1}>No pino 1</option>
      </select>
    </label>

    {#if impressao.pinoPulso !== -1}
      <div class="row">
        <div class="column">
          <label>
            Nivel alto
            <select bind:value={impressao.onPulso}>
              <option value={100}>100 ms</option>
              <option value={200}>200 ms</option>
              <option value={300}>300 ms</option>
              <option value={400}>400 ms</option>
              <option value={500}>500 ms</option>
            </select>
          </label>
        </div>
        <div class="column">
          <label>
            Nivel baixo
            <select bind:value={impressao.offPulso}>
              <option value={100}>100 ms</option>
              <option value={200}>200 ms</option>
              <option value={300}>300 ms</option>
              <option value={400}>400 ms</option>
              <option value={500}>500 ms</option>
            </select>
          </label>
        </div>
      </div>
    {/if}
  </div>
</div>

<div class="row">
  <div class="column column-50">
    <button on:click={() => impressao.testarDefinicoes()}>Testar impressão</button>
  </div>
</div>

<hr />

<h2>Ajuda</h2>
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
