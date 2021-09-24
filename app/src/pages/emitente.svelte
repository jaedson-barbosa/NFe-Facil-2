<script lang="ts">
  import { updateDoc } from 'firebase/firestore'
  import { empresa, idEmpresa, refEmpresa } from '../code/store'
  import Emit from '../parts-nfe/Emit.svelte'
  import { goto } from '@roxi/routify'
  import Voltar from '../components/Voltar.svelte'
  import { get } from 'svelte/store'

  let raiz = { ...get(empresa) }

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

<form on:submit|preventDefault={() => salvar()}>
  <h1><Voltar /> Emitente</h1>
  <Emit bind:raiz />
  <input type="submit" class="button" value="Salvar" />
</form>
