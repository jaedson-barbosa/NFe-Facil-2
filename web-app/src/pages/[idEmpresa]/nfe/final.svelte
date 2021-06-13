<script lang="ts">
  import { requisitar } from '@app/functions'
  import { url, goto } from '@roxi/routify'
  import { dbColumns, idEmpresa } from '@app/store'
  import { preparateJSON, generateXML } from './finalizacao'
  import { user } from '@app/store'
  import type INFeRoot from './INFeRoot'

  export let scoped: INFeRoot
  let loading = false
  const isNFCe = scoped.ide.mod == 65

  async function salvar() {
    loading = true
    const notasCol = isNFCe ? $dbColumns.notasCSalvas : $dbColumns.notasSalvas
    if (scoped.Id) {
      const docRef = notasCol.doc(scoped.Id)
      const doc = await docRef.get()
      if (doc.exists) await docRef.delete()
    }
    const xml = generateXML(scoped)
    const dhEmi = new Date(scoped.ide.dhEmi)
    const newRegister = { infNFe: scoped, dhEmi, xml }
    await notasCol.doc(scoped.Id).set(newRegister)
    $goto(isNFCe ? './:id/csalva' : './:id/salva', { id: scoped.Id })
  }

  async function transmitir() {
    if (isNFCe) {
      alert('Função ainda não implementada.')
      return
    }
    loading = true
    const infNFe = preparateJSON(scoped)
    const idToken = await $user.getIdToken()
    const resp = await requisitar(
      'transmitirNFe',
      { idEmpresa, infNFe, oldId: scoped.Id },
      idToken
    )
    const respText = await resp.text()
    if (resp.status == 201) {
      $goto('./:id', { id: respText })
    } else {
      alert(respText)
      loading = false
    }
  }
</script>

{#if loading}
  <progress class="progress is-large" />
{:else}
  <div class="container content box">
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('./opcionais')} class="button is-danger">
          Voltar: Opcionais
        </a>
      </p>
      <p class="control">
        <button class="button" on:click={salvar}> Apenas salvar </button>
      </p>
      <p class="control">
        <button class="button is-primary" on:click={transmitir}>
          Transmitir
        </button>
      </p>
    </div>
  </div>
{/if}
