<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { dbColumns, userStatus } from '@app/store'
  import { det } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'

  export let id: string

  let loading = false
  let root: any

  $dbColumns.produtos
    .doc(id)
    .get()
    .then((v) => (root = v.data()))

  async function salvar() {
    loading = true
    try {
      const det = root.det
      const _id = det.prod.cProd
      if (_id != id) {
        alert('Não é permitido alterar o código de um produto cadastrado.')
        return
      }
      await $dbColumns.produtos.doc(id).set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }

  const detUnico = det as any
  detUnico.maxOccurs = 1
  detUnico.annotation.label = 'Informações do produto'
</script>

{#if root}
  <form on:submit|preventDefault={salvar}>
    <fieldset disabled={loading}>
      <AutoForm el={detUnico} {root}>
        <input type="submit" class="button">
      </AutoForm>
    </fieldset>
  </form>
{/if}
