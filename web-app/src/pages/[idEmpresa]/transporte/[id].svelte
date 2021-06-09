<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { dbColumns } from '@app/store'
  import { transp } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'

  export let id: string

  let loading = false
  let root: any

  $dbColumns.transportes
    .doc(id)
    .get()
    .then((v) => (root = v.data()))

  async function salvar(root: any) {
    loading = true
    try {
      const transporta = root.transporta
      const _id = transporta.CPF ? transporta.CPF : transporta.CNPJ
      if (_id != id) {
        alert('Não é permitido alterar o documento de um cliente cadastrado.')
        return
      }
      await $dbColumns.transportes.doc(id).set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }

  const transporta = transp.element[1]
  transporta.optional = false
</script>

{#if root}
  <form on:submit|preventDefault={() => salvar(root)}>
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
{/if}
