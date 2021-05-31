<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { elementosNFe } from '@form/dataHelper'
  import AutoForm from '@form/AutoForm.svelte'

  export let idEmpresa: string

  let loading = false
  const root = {}

  async function salvar() {
    loading = true
    try {
      await db
        .collection('empresas')
        .doc(idEmpresa)
        .collection('produtos')
        .add(root)
      $goto('../produtos')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }

  const detUnico = elementosNFe[6] as any
  detUnico.maxOccurs = 1
  detUnico.annotation.label = "Informações do produto"
</script>

{@debug root}
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
          <button type="reset" class="button is-warning"> Limpar </button>
        </p>
        <p class="control">
          <a href={$url('../produtos')} class="button is-danger"> Cancelar </a>
        </p>
      </div>
    </AutoForm>
  </fieldset>
</form>
