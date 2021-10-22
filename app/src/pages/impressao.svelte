<script lang="ts">
  import Voltar from '../components/Voltar.svelte'
  import { CutTypes, ImageModes } from 'browser-thermal-printer-encoder'
  import { Fonts } from 'bdf-fonts'
  import { Configuracoes } from '../code/impressao-nfce/configuracao-dinamica'
  import { empresa, refEmpresa } from '../code/store'
  import { Tamanho } from '../code/impressao-nfce/configuracao'
  import { Metodo, pixelizarImagem } from '../code/impressao-nfce/pixelizacao'
  import { updateDoc } from 'firebase/firestore'
  import { defaultCatch } from '../code/firebase'

  let imagemOriginal: HTMLImageElement
  $: {
    if (imagemOriginal) {
      const metodo = $empresa.logotipo.pixelizacao
      pixelizarImagem(imagemOriginal, exibLogotipo, metodo)
    }
  }

  let novoLogotipo: FileList

  $: {
    if (novoLogotipo.length) {
      getBase64(novoLogotipo.item(0))
        .then(
          (data) =>
            ($empresa.logotipo = {
              imagem: data,
              alinhamento: 'L',
              monocromatico: false,
              pixelizacao: Metodo.atkinson,
              tamanho: Tamanho.P,
            })
        )
        .catch(defaultCatch)
    }
  }

  function getBase64(file: File) {
    return new Promise<string>((res, rej) => {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => res(reader.result as string)
      reader.onerror = (e) => rej(e)
    })
  }

  let exibLogotipo: HTMLCanvasElement

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

  const impressao = new Configuracoes()

  async function salvarLogotipo() {
    await updateDoc($refEmpresa, $empresa)
    alert('Alterações de logotipo salvas com sucesso.')
  }

  async function removerLogotipo() {
    novoLogotipo = undefined
    delete $empresa.logotipo
    await salvarLogotipo()
  }
</script>

<h1><Voltar /> Definições de impressão</h1>

<h2>Logotipo</h2>

{#if $empresa.logotipo}
  <figure>
    <img
      src={$empresa.logotipo.imagem}
      alt="Logotipo da empresa"
      bind:this={imagemOriginal}
    />
    <figcaption>Logotipo selecionado</figcaption>
  </figure>

  <h3>Inserção no DANFE NF-e</h3>
  <div class="row">
    <div class="column">
      <label>
        Alinhamento
        <select bind:value={$empresa.logotipo.alinhamento}>
          <option value="L">Esquerda</option>
          <option value="C">Centro</option>
          <option value="R">Direita</option>
          <option value="F">Completo</option>
        </select>
      </label>
    </div>
    <div class="column">
      <label>
        <input type="checkbox" bind:checked={$empresa.logotipo.monocromatico} />
        Logotipo monocromático
      </label>
    </div>
  </div>

  <h3>Inserção no DANFE NFC-e</h3>
  <div class="row">
    <div class="column">
      <label>
        Tamanho do logotipo
        <select bind:value={$empresa.logotipo.tamanho}>
          <option value={Tamanho.P}>Pequeno</option>
          <option value={Tamanho.M}>Médio</option>
          <option value={Tamanho.G}>Grande</option>
        </select>
      </label>
    </div>
    <div class="column">
      <label>
        Método de renderização
        <select bind:value={$empresa.logotipo.pixelizacao}>
          <option value={Metodo.threshold}>Preto e branco simples</option>
          <option value={Metodo.bayer}>Método de Bayer</option>
          <option value={Metodo.floydsteinberg}>
            Método de Floyd–Steinberg
          </option>
          <option value={Metodo.atkinson}>Método de Atkinson</option>
        </select>
      </label>
    </div>
  </div>
  <figure>
    <canvas bind:this={exibLogotipo} style="max-width: 100%;" />
    <figcaption>Pré-visualização para o DANFE NFC-e</figcaption>
  </figure>

  <div class="row">
    <div class="column">
      <button on:click={salvarLogotipo}>Salvar definições de logotipo</button>
    </div>
    <div class="column">
      <button on:click={removerLogotipo}>Remover logotipo</button>
    </div>
  </div>
{:else}
  <label class="button">
    Selecionar logotipo
    <input type="file" accept="image/*" bind:files={novoLogotipo} />
  </label>
{/if}

<br />

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

    <label>
      Tamanho do QR Code
      <select bind:value={impressao.tamanhoQR}>
        <option value={Tamanho.P}>Pequeno</option>
        <option value={Tamanho.M}>Médio</option>
        <option value={Tamanho.G}>Grande</option>
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
    <button on:click={() => impressao.testarDefinicoes()}>
      Testar impressão de texto
    </button>
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
