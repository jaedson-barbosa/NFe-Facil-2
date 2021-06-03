<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { dest } from '@form/data/nfe.json'
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
        .collection('clientes')
        .add(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

{@debug root}
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
          <button type="reset" class="button is-warning"> Limpar </button>
        </p>
        <p class="control">
          <a href={$url('../')} class="button is-danger"> Cancelar </a>
        </p>
      </div>
    </AutoForm>
  </fieldset>
</form>
