<script lang="ts">
  import { updateDoc } from 'firebase/firestore'
  import { empresa, idEmpresa, refEmpresa } from '../code/store'
  import Emit from '../parts-nfe/Emit.svelte'
  import { goto } from '@roxi/routify'
  import Voltar from '../components/Voltar.svelte'

  let raiz = undefined
  $: $empresa && !raiz && (raiz = { ...$empresa })

  async function salvar() {
    try {
      if (raiz.emit.CNPJ != $idEmpresa) {
        alert('Não é permitida a alteração do CNPJ do emitente.')
        return
      }
      await updateDoc($refEmpresa, raiz)
      $goto('./')
    } catch (error) {
      alert(error.message)
    }
  }
</script>

{#if raiz}
  <h1><Voltar /> Atualização cadastral</h1>
  <form on:submit|preventDefault={() => salvar()}>
    <Emit bind:raiz />
    <input type="submit" class="button" value="Salvar" />
  </form>
{/if}
