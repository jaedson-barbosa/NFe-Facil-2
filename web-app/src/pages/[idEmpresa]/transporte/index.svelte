<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { isCpfValid, isCnpjValid } from '@app/documentUtils'
  import { transp } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'

  export let idEmpresa: string

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
      const docRef = db
        .collection('empresas')
        .doc(idEmpresa)
        .collection('transportes')
        .doc(id)
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
