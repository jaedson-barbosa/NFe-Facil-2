<script lang="ts">
  import { generate, toNFeString } from './rootGenerator'
  import { goto, url } from '@roxi/routify'
  import Container from '@form/Container.svelte'
  import ReadonlyV from '@form/ReadonlyV.svelte'
  import type INFeRoot from './INFeRoot'
  import { requisitar } from '@app/functions'
  import { user, dbColumns, empresa, idEmpresa } from '@app/store'
  // import { generateXML, preparateJSON } from './finalizacao';

  export let id: string
  export let scoped: { commom: { root: INFeRoot } }

  let loading = false

  async function carregar() {
    let status = 0
    let nota = await $dbColumns.notasSalvas
      .doc(id)
      .get()
    if (!nota.exists) {
      nota = await $dbColumns.notasEmitidas.doc(id).get()
      status = nota.get('cancelada') ? 2 : 1
      if (!nota.exists) {
        throw new Error('Id não reconhecido.')
      }
    }
    return {
      status,
      nNF: nota.get('infNFe.ide.nNF'),
      dhEmi: nota.get('dhEmi').toDate().toLocaleString(),
      xNome: nota.get('infNFe.dest.xNome'),
      nota,
    }
  }

  function editar(root: any) {
    const infNFe: INFeRoot = root.nota.get('infNFe')
    // const xml = generateXML(infNFe)
    // console.log(xml)
    // return
    const initialValue = generate($empresa, infNFe)
    scoped.commom.root = initialValue
    $goto('./identificacao')
  }

  async function gerarDANFE(emitida: boolean) {
    if (loading) return
    loading = true
    const token = await $user.getIdToken()
    const resp = await requisitar(
      'gerarDANFENFe',
      { idEmpresa, emitida, idNota: id },
      token
    )
    if (resp.status == 200) {
      let blob = await resp.blob()
      blob = new Blob([blob], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      window.open(url)
    } else {
      const text = await resp.text()
      alert(text)
    }
    loading = false
  }

  function abrirXML(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = window.URL.createObjectURL(blob)
    window.open(url)
  }

  function XML(root: any) {
    const xml = root.nota.get('xml')
    abrirXML(xml)
  }

  function XMLCancelamento(root: any) {
    const xmlCancelamento = root.nota.get('xmlCancelamento')
    abrirXML(xmlCancelamento)
  }

  async function cancelarNFe() {
    if (loading) return
    loading = true
    const justificativa = prompt('Motivação do cancelamento:')
    if (!justificativa) {
      alert('Operação cancelada pelo usuário')
      loading = false
      return
    }
    const token = await $user.getIdToken()
    const resp = await requisitar(
      'cancelarNFe',
      {
        idEmpresa,
        idNota: id,
        justificativa,
        dhEvento: toNFeString(new Date()),
      },
      token
    )
    if (resp.status == 200) {
      alert('Nota fiscal cancelada com sucesso')
      $goto('../')
    } else {
      const text = await resp.text()
      alert(text)
    }
    loading = false
  }
</script>

{#await carregar()}
  Carregando...
{:then root}
  <Container label="Informações da NFe">
    <ReadonlyV label="Número" value={root.nNF} />
    <ReadonlyV label="Data e hora" value={root.dhEmi} />
    <ReadonlyV label="Cliente" value={root.xNome} />
    <ReadonlyV
      label="Status"
      value={root.status == 0
        ? 'Apenas salva'
        : root.status == 1
        ? 'Emitida'
        : 'Cancelada'}
    />
    <div class="buttons is-centralized">
      <a class="button" href={$url('../')}> Voltar </a>
      <button class="button" on:click={() => editar(root)}>
        {root.status == 0 ? 'Editar' : 'Clonar'}
      </button>
      {#if root.status != 2}
        <button
          class="button"
          class:is-loading={loading}
          on:click={() => gerarDANFE(root.status > 0)}
        >
          Gerar DANFE
        </button>
      {/if}
      <button class="button" on:click={() => XML(root)}> Abrir XML </button>
      {#if root.status == 1}
        <button
          class="button"
          class:is-loading={loading}
          on:click={cancelarNFe}
        >
          Cancelar NFe
        </button>
      {:else if root.status == 2}
        <button class="button" on:click={() => XMLCancelamento(root)}>
          Abrir XML de cancelamento
        </button>
      {/if}
    </div>
  </Container>
{:catch erro}
  {erro.message}
  Não foi possível encontrar a nota
  <a href={$url('../')}>Voltar</a>
{/await}
