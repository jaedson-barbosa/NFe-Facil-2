<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { Dados } from '../app/dados'
  import { isCnpjValid, isCpfValid } from '../app/documentUtils'
  import { edicao, dbColumns } from '../app/store'
  import Dest from '../data-views/Dest.svelte'

  let loading = false
  let raiz = undefined

  const ed = get(edicao)
  if (ed) {
    if (ed.tipo != Dados.Clientes) $edicao = undefined
    else raiz = { ...ed.dado }
  } else raiz = {}

  async function salvar() {
    loading = true
    try {
      const dest = raiz.dest
      if (dest.CPF && !isCpfValid(dest.CPF)) {
        alert('CPF inválido.')
        return
      }
      if (dest.CNPJ && !isCnpjValid(dest.CNPJ)) {
        alert('CNPJ inválido.')
        return
      }
      const id = dest.CPF
        ? dest.CPF
        : dest.CNPJ
        ? dest.CNPJ
        : dest.idEstrangeiro
      const docRef = $dbColumns.clientes.doc(id)
      if (ed) {
        if (ed.id != id) {
          alert('Não é permitido alterar o documento.')
          loading = false
          return
        }
      } else {
        const doc = await docRef.get()
        const msg =
          'Já existe um cliente cadastrado com este documento. ' +
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
      console.error(error)
      alert(error.message)
      loading = false
    }
  }
</script>

<form on:submit|preventDefault={() => salvar()}>
  <fieldset disabled={loading}>
    <Dest bind:raiz />
    <input type="submit" class="button" />
  </fieldset>
</form>
