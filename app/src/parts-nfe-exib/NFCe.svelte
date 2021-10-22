<script lang="ts">
  import { IEdicao } from '../code/store'
  import { goto, url } from '@roxi/routify'
  import { onMount } from 'svelte'
  import { montar } from '../code/impressao-nfce/montagem'
  import { imprimirCanvas } from '../code/impressao-nfce/impressao'
  import { getLogotipo } from '../code/impressao-nfce/pixelizacao'

  export let ed: IEdicao

  const chave = ed?.id.substring(3)

  let linkDANFE: string

  function gerarLinkXML(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' })
    return window.URL.createObjectURL(blob)
  }

  let exibCanvas: HTMLCanvasElement

  function clonar() {
    ed.dado.infNFe.ide.nNF = '0'
    $goto('./nfe')
  }

  async function imprimir() {
    await imprimirCanvas(exibCanvas)
    alert('Tarefa de impressão da NFC-e enviada')
  }

  onMount(async () => {
    const logotipo = await getLogotipo()
    montar(exibCanvas, ed.dado.xml, logotipo)
    exibCanvas.toBlob((blob) => (linkDANFE = URL.createObjectURL(blob)))
  })
</script>

<div class="row">
  <div class="column">
    <button on:click={imprimir}>Imprimir DANFE</button>
  </div>
  <div class="column">
    <a class="button" href={linkDANFE} download="{chave}-DANFE.png">
      Baixar DANFE
    </a>
  </div>
</div>
<div class="row">
  <div class="column">
    <a
      class="button"
      href={gerarLinkXML(ed.dado.xml)}
      download="{chave}-procNFe.xml"
    >
      Baixar XML da NFe
    </a>
  </div>
  <div class="column">
    {#if ed.dado.nProt}
      <button on:click={clonar}>Clonar</button>
    {:else}
      <a class="button" href={$url('./nfe')}>Editar</a>
    {/if}
  </div>
</div>

<canvas bind:this={exibCanvas} />
