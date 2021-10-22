<script lang="ts">
  import { updateDoc } from 'firebase/firestore'
  import { empresa, refEmpresa } from '../code/store'
  import { goto } from '@roxi/routify'
  import Voltar from '../components/Voltar.svelte'

  let raiz = undefined
  $: $empresa && !raiz && (raiz = { ...$empresa })

  async function salvar() {
    await updateDoc($refEmpresa, raiz)
    $goto('./')
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
      ID CSC <small>Id do CSC de produção</small>
      <input bind:value={raiz.IDCSC} />
    </label>
    <label>
      CSC <small>CSC de produção</small>
      <input bind:value={raiz.CSC} />
    </label>
    <label>
      ID CSC <small>Id do CSC de homologação</small>
      <input bind:value={raiz.IDCSCh} />
    </label>
    <label>
      CSC <small>CSC de homologação</small>
      <input bind:value={raiz.CSCh} />
    </label>
    <small>
      Caso o Id e CSC de homologação não sejam preenchidos, será utilizado o Id
      e CSC de produção mesmo nas requisições no ambiente de homologação.
    </small>

    <h3>Acesso ao IBPT</h3>
    <label>
      Token de acesso
      <input bind:value={raiz.tokenIBPT} />
    </label>
    <input type="submit" class="button" value="Salvar" />
  </form>
{/if}
