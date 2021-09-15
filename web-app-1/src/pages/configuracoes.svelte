<script lang="ts">
  import { updateDoc } from 'firebase/firestore'
  import { empresa, refEmpresa } from '../code/store'
  import { goto } from '@roxi/routify'
  import Voltar from '../components/Voltar.svelte'

  let raiz = undefined
  $: $empresa && !raiz && (raiz = { ...$empresa })

  async function salvar() {
    try {
      await updateDoc($refEmpresa, raiz)
      $goto('./')
    } catch (error) {
      alert(error.message)
    }
  }
</script>

{#if raiz}
  <h1><Voltar /> Configurações</h1>
  <form on:submit|preventDefault={() => salvar()}>
    <h3>Emissão de NF-e</h3>
    <label>
      Série da NF-e <small>Série atual de emissão das NF-es</small>
      <input bind:value={raiz.serieNFe} pattern={'0|[1-9]{1}[0-9]{0,2}'} />
    </label>

    <h3>Emissão de NFC-e</h3>
    <label>
      Série da NFC-e <small>Série atual de emissão das NFC-es</small>
      <input bind:value={raiz.serieNFCe} pattern={'0|[1-9]{1}[0-9]{0,2}'} />
    </label>
    <label>
      ID CSC <small>Identificador do CSC</small>
      <input bind:value={raiz.IDCSC} />
    </label>
    <label>
      CSC <small>Código de Segurança do Contribuinte</small>
      <input bind:value={raiz.CSC} />
    </label>
    <input type="submit" class="button" />
  </form>
{/if}
