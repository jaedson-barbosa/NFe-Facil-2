<script lang="ts">
  import { carregando, IEdicao } from '../code/store'
  import { goto, url } from '@roxi/routify'
  import { cancelarNF } from '../code/firebase'
  import { toNFeString } from '../code/getDataString'

  export let ed: IEdicao

  const chave = ed?.id.substring(3)

  async function cancelar() {
    $carregando = true
    const justificativa = prompt('Motivação do cancelamento:')
    if (!justificativa) {
      alert('Operação cancelada pelo usuário')
      return
    }
    const res = await cancelarNF({
      idNota: ed.id,
      justificativa: justificativa.trim(),
      dhEvento: toNFeString(new Date()),
    })
    if (res.data.cancelada) {
      alert('Nota fiscal cancelada com sucesso.')
      $goto('./')
    }
    $carregando = false
  }

  function gerarLinkXML(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' })
    return window.URL.createObjectURL(blob)
  }

  let linkDANFE = undefined
  async function gerarDANFE() {
    $carregando = true
    linkDANFE = ''
    const xml = ed.dado.xml
    const parametros = {
      xml: xml.replace(/>\s+</g, '><'),
      orientacao: 'P',
      margSup: 5,
      margEsq: 5,
    }
    const enderecoAPI =
      'https://southamerica-east1-nfe-facil-980bc.cloudfunctions.net/gerarDANFE'
    const corpoRequisicao = {
      method: 'POST',
      body: JSON.stringify(parametros),
    }
    const danfe = await fetch(enderecoAPI, corpoRequisicao)
    const pdf = await danfe.blob()
    linkDANFE = window.URL.createObjectURL(pdf)
    $carregando = false
  }

  function clonar() {
    ed.dado.infNFe.ide.nNF = '0'
    $goto('./nfe')
  }
</script>

{#if !$carregando}
  <p>
    <strong>Chave:</strong>
    {chave}
  </p>

  {#if !ed.dado.cancelada}
    {#if linkDANFE}
      <a class="button" href={linkDANFE} target="_blank">Abrir DANFE</a>
      <a class="button" href={linkDANFE} download="{chave}-DANFE.pdf">
        Baixar DANFE
      </a>
    {:else if linkDANFE === undefined}
      <button on:click={gerarDANFE}>Carregar DANFE</button>
    {/if}
  {/if}

  <a
    class="button"
    href={gerarLinkXML(ed.dado.xml)}
    download="{chave}-procNFe.xml"
  >
    Baixar XML da NFe
  </a>

  {#if ed.dado.nProt}
    <button on:click={clonar}>Clonar</button>
    {#if ed.dado.cancelada}
      <a
        class="button"
        href={gerarLinkXML(ed.dado.xmlCancelamento)}
        download="{chave}-procEventoNFe.xml"
      >
        Baixar XML do cancelamento
      </a>
    {:else}
      <button on:click={cancelar}>Solicitar cancelamento</button>
    {/if}
  {:else}
    <a class="button" href={$url('./nfe')}>Editar</a>
  {/if}
{/if}
