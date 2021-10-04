<script lang="ts">
  import { edicao, permissaoEscrita } from '../code/store'
  import { goto, url } from '@roxi/routify'
  import { cancelarNFe } from '../code/firebase'
  import { toNFeString } from '../code/getDataString'
  import { Dados } from '../code/tipos'
  import { get } from 'svelte/store'
  import Voltar from '../components/Voltar.svelte'

  const ed = get(edicao)
  if (!ed || ed.tipo != Dados.NFes) {
    alert('Abertura inválida de página.')
    $goto('/index')
  }
  const chave = ed?.id.substring(3)

  let carregando = false

  async function cancelar() {
    carregando = true
    const justificativa = prompt('Motivação do cancelamento:')
    if (!justificativa) {
      alert('Operação cancelada pelo usuário')
      return
    }
    const res = await cancelarNFe({
      idNota: ed.id,
      justificativa: justificativa.trim(),
      dhEvento: toNFeString(new Date()),
    })
    if (res.data.cancelada) {
      alert('Nota fiscal cancelada com sucesso.')
      $goto('./')
    }
    carregando = false
  }

  function gerarLinkXML(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' })
    return window.URL.createObjectURL(blob)
  }

  let linkDANFE = undefined
  async function gerarDANFE() {
    carregando = true
    linkDANFE = ''
    const xml = ed.dado.xml
    const parametros = {
      xml: xml.replace(/>\s+</g, '><'),
      orientacao: 'P',
      margSup: 5,
      margEsq: 5,
    }
    const enderecoAPI =
      'https://us-central1-nfe-facil-980bc.cloudfunctions.net/helloWorld'
    const corpoRequisicao = {
      method: 'POST',
      body: JSON.stringify(parametros),
    }
    const danfe = await fetch(enderecoAPI, corpoRequisicao)
    const pdf = await danfe.blob()
    linkDANFE = window.URL.createObjectURL(pdf)
    carregando = false
  }
</script>

{#if carregando}
  Carregando...
{:else if ed}
  <h1><Voltar /> Detalhes da nota fiscal</h1>
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
    {#if permissaoEscrita}
      <a class="button" href={$url('./nfe')}>Clonar</a>
    {/if}
    {#if ed.dado.cancelada}
      <a
        class="button"
        href={gerarLinkXML(ed.dado.xmlCancelamento)}
        download="{chave}-procEventoNFe.xml"
      >
        Baixar XML do cancelamento
      </a>
    {:else if permissaoEscrita}
      <button on:click={cancelar}>Solicitar cancelamento</button>
    {/if}
  {:else if permissaoEscrita}
    <a class="button" href={$url('./nfe')}>Editar</a>
  {/if}
{/if}
