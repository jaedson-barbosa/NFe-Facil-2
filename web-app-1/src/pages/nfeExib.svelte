<script lang="ts">
  import { edicao } from '../code/store'
  import { goto, url } from '@roxi/routify'
  import { cancelarNFe } from '../code/firebase'
  import { toNFeString } from '../code/getDataString'
  import { Dados } from '../code/tipos'
  import { get } from 'svelte/store'

  const ed = get(edicao)
  if (!ed || ed.tipo != Dados.NFes) {
    alert('Abertura inválida de página.')
    $goto('/index')
  }

  async function cancelar() {
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
    if (res.data.cancelada) alert('Nota fiscal cancelada com sucesso.')
  }

  function abrirXML(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' })
    window.open(window.URL.createObjectURL(blob))
  }

  function XMLNota() {
    abrirXML(ed.dado.xml)
  }

  function XMLCancelamento() {
    abrirXML(ed.dado.xmlCancelamento)
  }

  async function gerarDANFENFe() {
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
    const pdf = danfe.blob()
    const enderecoPDF = window.URL.createObjectURL(pdf)
    window.open(enderecoPDF)
  }
</script>

<h1>Detalhes da nota fiscal</h1>
<p>
  <strong>ID:</strong>
  {ed.id}
</p>
<button on:click={gerarDANFENFe}>DANFE</button>
<button on:click={XMLNota}>XML</button>
{#if ed.dado.nProt}
  <a class="button" href={$url('./nfe')}>Clonar</a>
  {#if ed.dado.cancelada}
    <button on:click={XMLCancelamento}>XML de cancelamento</button>
  {:else}
    <button on:click={cancelar}>Cancelar</button>
  {/if}
{:else}
  <a class="button" href={$url('./nfe')}>Editar</a>
{/if}
