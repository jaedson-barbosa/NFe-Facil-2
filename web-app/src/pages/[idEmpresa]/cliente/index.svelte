<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { isCpfValid, isCnpjValid } from '@app/documentUtils'
  import { dest } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'
  import { dbColumns } from '@app/store'

  let loading = false
  const root: any = {}

  async function salvar() {
    loading = true
    try {
      const dest = root.dest
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
      const doc = await docRef.get()
      if (doc.exists) {
        alert('Já existe um cliente cadastrado com este documento.')
        return
      }
      await docRef.set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

<form on:submit|preventDefault={salvar}>
  <fieldset disabled={loading}>
    <AutoForm el={dest} {root}>
      <input type="submit" class="button">
    </AutoForm>
  </fieldset>
</form>
