<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { dest } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'
  import { dbColumns, userStatus } from '@app/store'

  export let id: string

  let loading = false
  let root: any

  $dbColumns.clientes
    .doc(id)
    .get()
    .then((v) => (root = v.data()))

  async function salvar(root: any) {
    loading = true
    try {
      const dest = root.dest
      const _id = dest.CPF
        ? dest.CPF
        : dest.CNPJ
        ? dest.CNPJ
        : dest.idEstrangeiro
      if (_id != id) {
        alert('Não é permitido alterar o documento de um cliente cadastrado.')
        return
      }
      await $dbColumns.clientes.doc(id).set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

{#if root}
  <form on:submit|preventDefault={() => salvar(root)}>
    <fieldset disabled={loading}>
      <AutoForm el={dest} {root}>
        <input type="submit" class="button">
      </AutoForm>
    </fieldset>
  </form>
{/if}
