<script lang="ts">
  import { updateDoc } from 'firebase/firestore'
  import { empresa, refEmpresa } from '../code/store'
  import { goto } from '@roxi/routify'
  import Voltar from '../components/Voltar.svelte'

  let raiz = undefined
  $: $empresa && !raiz && (raiz = { ...$empresa })

  async function salvar() {
    await updateDoc(refEmpresa, raiz)
    $goto('./')
  }
</script>

{#if raiz}
  <h1><Voltar /> Configurações</h1>
  <form on:submit|preventDefault={() => salvar()}>
    <h3>Emissão de NF-e</h3>
    <label>
      Série NF-e
      <input bind:value={raiz.serieNFe} pattern={'0|[1-9]{1}[0-9]{0,2}'} required />
    </label>

    <h3>Emissão de NFC-e</h3>
    <label>
      Série NFC-e
      <input bind:value={raiz.serieNFCe} pattern={'0|[1-9]{1}[0-9]{0,2}'} required />
    </label>
    <label>
      ID CSC produção
      <input bind:value={raiz.IDCSC} />
    </label>
    <label>
      CSC produção
      <input bind:value={raiz.CSC} />
    </label>
    <label>
      <i>ID CSC homologação</i>
      <input bind:value={raiz.IDCSCh} />
    </label>
    <label>
      <i>CSC homologação</i>
      <input bind:value={raiz.CSCh} />
    </label>

    <h3>Acesso ao IBPT</h3>
    <label>
      Token de acesso
      <input bind:value={raiz.tokenIBPT} required />
    </label>
    <input type="submit" class="button" value="Salvar" />
  </form>
{/if}
