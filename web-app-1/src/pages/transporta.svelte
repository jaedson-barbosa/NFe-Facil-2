<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { Dados } from '../app/dados'
  import { isCnpjValid, isCpfValid } from '../app/documentUtils'
  import { edicao, dbColumns } from '../app/store'
  import Transporta from '../data-views/Transporta.svelte'

  let loading = false
  let raiz = undefined

  const ed = get(edicao)
  if (ed) {
    if (ed.tipo != Dados.Transportes) $edicao = undefined
    else raiz = { ...ed.dado }
  } else raiz = {}

  async function salvar() {
    loading = true
    try {
      const transporta = raiz.transporta
      if (transporta.CPF && !isCpfValid(transporta.CPF)) {
        alert('CPF inválido.')
        return
      }
      if (transporta.CNPJ && !isCnpjValid(transporta.CNPJ)) {
        alert('CNPJ inválido.')
        return
      }
      const id = transporta.CPF ? transporta.CPF : transporta.CNPJ
      const docRef = $dbColumns.transportes.doc(id)
      if (ed) {
        if (ed.id != id) {
          alert('Não é permitido alterar o documento.')
          loading = false
          return
        }
      } else {
        const doc = await docRef.get()
        const msg =
          'Já existe um transportador cadastrado com este documento. ' +
          'Deseja substituí-lo?'
        if (doc.exists && !confirm(msg)) {
          loading = false
          return
        }
      }
      await docRef.set(raiz)
      $edicao = undefined
      $goto('./')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

<form on:submit|preventDefault={() => salvar()}>
  <fieldset disabled={loading}>
    <Transporta bind:raiz />
    <input type="submit" class="button" />
  </fieldset>
</form>
