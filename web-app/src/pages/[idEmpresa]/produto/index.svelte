<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { dbColumns } from '@app/store'
  import { det } from '@form/data/nfe.json'
  import { createId } from '@form/helpers'
  import AutoForm from '@form/AutoForm.svelte'

  let loading = false
  let root: any = {}

  async function salvar() {
    loading = true
    try {
      const det = root.det
      const docRef = $dbColumns.produtos.doc(det.prod.cProd)
      const doc = await docRef.get()
      if (doc.exists) {
        alert(
          'Já existe um produto com este código.' +
            'Se este código foi gerado aleatoriamente, ' +
            'basta gerar outro para corrigir este problema.'
        )
        return
      }
      await docRef.set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }

  function gerarCodigo() {
    root.prod.cProd = createId(5)
    root = root
  }

  const detUnico = det as any
  detUnico.maxOccurs = 1
  detUnico.annotation.label = 'Informações do produto'
</script>

<form on:submit|preventDefault={salvar}>
  <fieldset disabled={loading}>
    <AutoForm el={detUnico} {root}>
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button class="button is-primary" class:is-loading={loading}>
            Salvar
          </button>
        </p>
        <p class="control">
          <button
            type="button"
            class="button is-warning"
            on:click={gerarCodigo}
          >
            Gerar código aleatório
          </button>
        </p>
        <p class="control">
          <a href={$url('../')} class="button is-danger"> Cancelar </a>
        </p>
      </div>
    </AutoForm>
  </fieldset>
</form>
