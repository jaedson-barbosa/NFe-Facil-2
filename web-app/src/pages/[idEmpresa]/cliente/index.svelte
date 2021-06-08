<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { isCpfValid, isCnpjValid } from '@app/documentUtils'
  import { dest } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'

  export let idEmpresa: string

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
      const docRef = db
        .collection('empresas')
        .doc(idEmpresa)
        .collection('clientes')
        .doc(id)
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
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button class="button is-primary" class:is-loading={loading}>
            Salvar
          </button>
        </p>
        <p class="control">
          <a href={$url('../')} class="button is-danger"> Cancelar </a>
        </p>
      </div>
    </AutoForm>
  </fieldset>
</form>
