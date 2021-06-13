<script lang="ts">
  import { generateNFe, generateNFCe, toNFeString } from '../../rootGenerator'
  import { goto, url } from '@roxi/routify'
  import Container from '@form/Container.svelte'
  import ReadonlyV from '@form/ReadonlyV.svelte'
  import type INFeRoot from '../../INFeRoot'
  import { requisitar } from '@app/functions'
  import { user, empresa, idEmpresa, userStatus } from '@app/store'
  import type { TColumn, TDocument } from '@app/store'
  import type { IScoped } from '../IScoped'
  // import { generateXML, preparateJSON } from './finalizacao';

  export let scoped: IScoped
  export let coluna: TColumn
  export let isNFCe: boolean

  let loading = false
  let root: {
    status: number
    nNF: string
    dhEmi: string
    nota: TDocument
  }

  coluna
    .doc(scoped.id)
    .get()
    .then((nota) => {
      const cancelada = nota.get('cancelada')
      const status = cancelada ? 2 : cancelada == false ? 1 : 0
      if (!nota.exists) {
        alert('Nota fiscal não encontrada.')
        $goto('../../')
      }
      root = {
        status,
        nNF: nota.get('infNFe.ide.nNF'),
        dhEmi: nota.get('dhEmi').toDate().toLocaleString(),
        nota,
      }
    })

  function editar(root: any) {
    const infNFe: INFeRoot = root.nota.get('infNFe')
    // const xml = generateXML(infNFe)
    // console.log(xml)
    // return
    const result = isNFCe
      ? generateNFCe($empresa, infNFe)
      : generateNFe($empresa, infNFe)
    scoped.updateScoped(result)
    $goto('../identificacao')
  }

  async function gerarDANFE(emitida: boolean) {
    if (isNFCe) {
      alert('Função ainda não implementada.')
      return
    }
    if (loading) return
    loading = true
    const token = await $user.getIdToken()
    const resp = await requisitar(
      'gerarDANFENFe',
      { idEmpresa, emitida, idNota: scoped.id },
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
    if (isNFCe) {
      alert('Função ainda não implementada.')
      return
    }
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
        idNota: scoped.id,
        justificativa,
        dhEvento: toNFeString(new Date()),
      },
      token
    )
    if (resp.status == 200) {
      alert('Nota fiscal cancelada com sucesso')
      $goto('../../')
    } else {
      const text = await resp.text()
      alert(text)
    }
    loading = false
  }
</script>

{#if root}
  <Container label="Informações da NFe">
    <ReadonlyV label="Número" value={root.nNF} />
    <ReadonlyV label="Data e hora" value={root.dhEmi} />
    <ReadonlyV
      label="Cliente"
      value={root.nota.get('infNFe.dest.xNome') ?? 'Cliente não informado'}
    />
    <ReadonlyV
      label="Status"
      value={root.status == 0
        ? 'Apenas salva'
        : root.status == 1
        ? 'Emitida'
        : 'Cancelada'}
    />
    <div class="buttons is-centralized">
      <a class="button" href={$url('../../')}> Voltar </a>
      {#if $userStatus >= 3}
        <button class="button" on:click={() => editar(root)}>
          {root.status == 0 ? 'Editar' : 'Clonar'}
        </button>
      {/if}
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
      {#if root.status == 1 && $userStatus >= 3}
        <button
          class="button"
          class:is-loading={loading}
          on:click={cancelarNFe}
        >
          Cancelar
        </button>
      {:else if root.status == 2}
        <button class="button" on:click={() => XMLCancelamento(root)}>
          Abrir XML de cancelamento
        </button>
      {/if}
    </div>
  </Container>
{/if}
