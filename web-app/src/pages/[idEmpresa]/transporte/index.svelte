<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { dbColumns } from '@app/store'
  import { isCpfValid, isCnpjValid } from '@app/documentUtils'
  import { transp } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'

  let loading = false
  const root: any = {}

  async function salvar() {
    loading = true
    try {
      const transporta = root.transporta
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
      const doc = await docRef.get()
      if (doc.exists) {
        alert('Já existe um transportador cadastrado com este documento.')
        return
      }
      await docRef.set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }

  const transporta = transp.element[1]
  transporta.optional = false
</script>

<form on:submit|preventDefault={salvar}>
  <fieldset disabled={loading}>
    <AutoForm el={transporta} {root}>
      <input type="submit" class="button">
    </AutoForm>
  </fieldset>
</form>
