<script lang="ts">
  import { generate } from './rootGenerator'
  import { params } from '@sveltech/routify'
  import { url, goto } from '@sveltech/routify'
  import Container from '@form/Container.svelte'
  import ReadonlyV from '@form/ReadonlyV.svelte'
  import { db } from '@app/firebase'
  import type INFeRoot from './INFeRoot'

  export let id: string
  $: idEmpresa = $params['idEmpresa']
  export let scoped: { commom: { root: INFeRoot } }

  async function carregar() {
    const nota = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('notas')
      .doc(id)
      .get()
    if (!nota.exists) {
      throw new Error('Id não reconhecido.')
    }
    return {
      status: nota.get('status'),
      nNF: nota.get('infNFe.ide.nNF'),
      dhEmi: nota.get('dhEmi').toDate().toLocaleString(),
      xNome: nota.get('infNFe.dest.xNome'),
      nota,
    }
  }

  async function editar(root: any) {
    const infNFe: INFeRoot = root.nota.get('infNFe')
    const v = await db.collection('empresas')
      .doc(idEmpresa)
      .get()
    const empresa = v.data()
    const initialValue = generate(empresa, infNFe)
    scoped.commom.root = initialValue
    $goto('../identificacao')
  }

  function gerarDANFE() {
    alert('Ainda não implementado')
  }

  function abrirXML(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = window.URL.createObjectURL(blob)
    window.open(url)
  }

  function XML(root: any) {
    const xml = root.nota.get('xml')
    abrirXML(xml)
    if (root.status == 2) {
      const xmlCancelamento = root.nota.get('xmlCancelamento')
      abrirXML(xmlCancelamento)
    }
  }

  function cancelarNFe() {
    alert('Ainda não implementado')
  }
</script>

{#await carregar()}
  Carregando...
{:then root}
  <Container label="Informações da NFe">
    <ReadonlyV label="Número" value={root.nNF} />
    <ReadonlyV label="Data e hora" value={root.dhEmi} />
    <ReadonlyV label="Cliente" value={root.xNome} />
    {#if root.status == 0}
      <ReadonlyV label="Status" value="Apenas salva" />
      <div class="buttons is-centralized">
        <button class="button" on:click={() => editar(root)}> Editar </button>
        <button class="button" on:click={gerarDANFE}> Gerar DANFE </button>
        <button class="button" on:click={() => XML(root)}> Baixar XML </button>
      </div>
      <!-- Ações para cada status! -->
    {:else if root.status == 1}
      <ReadonlyV label="Status" value="Emitida" />
      <div class="buttons is-centralized">
        <button class="button" on:click={gerarDANFE}> Gerar DANFE </button>
        <button class="button" on:click={() => XML(root)}> Abrir XML </button>
        <button class="button" on:click={cancelarNFe}> Cancelar NFe </button>
      </div>
    {:else if root.status == 2}
      <ReadonlyV label="Status" value="Cancelada" />
      <div class="buttons is-centralized">
        <button class="button" on:click={gerarDANFE}> Gerar DANFE </button>
        <button class="button" on:click={() => XML(root)}> Abrir XMLs </button>
      </div>
    {/if}
  </Container>
{/await}
