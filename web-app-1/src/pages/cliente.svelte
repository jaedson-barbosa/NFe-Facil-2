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
    if (ed.tipo != Dados.Clientes) {
      $edicao = undefined
      raiz = {}
    } else raiz = { ...ed.dado }
  } else raiz = {}

  async function salvar() {
    loading = true
    try {
      const dest = raiz.dest
      if (dest.CPF && !isCpfValid(dest.CPF)) {
        loading = false
        alert('CPF inválido.')
        return
      }
      if (dest.CNPJ && !isCnpjValid(dest.CNPJ)) {
        loading = false
        alert('CNPJ inválido.')
        return
      }
      const id = dest.CPF
        ? dest.CPF
        : dest.CNPJ
        ? dest.CNPJ
        : dest.idEstrangeiro
      const docRef = $dbColumns.clientes.doc(id)
      if (ed && ed.id != id) {
        alert('Não é permitido alterar o documento.')
        loading = false
        return
      } else if (
        !ed &&
        (await docRef.get()).exists &&
        !confirm('Já existe um cliente com este documento. Substituir?')
      ) {
        loading = false
        return
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

{#if loading}
  Carregando...
{:else}
  <form on:submit|preventDefault={() => salvar()}>
    <Dest bind:raiz />
    <input type="submit" class="button" />
  </form>
{/if}
