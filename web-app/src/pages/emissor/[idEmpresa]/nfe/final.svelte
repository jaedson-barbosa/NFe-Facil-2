<script lang="ts">
  import { requisitar } from '@app/functions'
  import { url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { preparateJSON, generateXML } from './finalizacao'
  import { user } from '@app/store'
  import type INFeRoot from './INFeRoot'

  export let scoped: { commom: { root: INFeRoot } }
  export let idEmpresa: string
  let loading = false

  async function salvar() {
    loading = true
    const infNFe = scoped.commom.root
    const oldId = infNFe.Id
    const notasCol = db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('notasSalvas')
    if (oldId) {
      const docRef = notasCol.doc(oldId)
      const doc = await docRef.get()
      if (doc.exists) {
        if (doc.get('status') == 0) {
          await docRef.delete()
        } else {
          alert('Proibido: nota fiscal já emitida ou cancelada.')
          loading = false
          return
        }
      }
    }
    const xml = generateXML(infNFe)
    const dhEmi = new Date(infNFe.ide.dhEmi)
    const newRegister = { infNFe, dhEmi, xml }
    await notasCol.doc(infNFe.Id).set(newRegister)
    $goto('./:id', { id: infNFe.Id })
  }

  async function transmitir() {
    loading = true
    const infNFe = preparateJSON(scoped.commom.root, false)
    const idToken = await $user.getIdToken()
    const resp = await requisitar('transmitirNFe', { idEmpresa, infNFe }, idToken)
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
