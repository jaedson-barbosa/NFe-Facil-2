<script lang="ts">
  import { params, url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { det } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'

  export let id: string
  $: idEmpresa = $params['idEmpresa']

  let loading = false

  async function carregar() {
    const prod = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('produtos')
      .doc(id)
      .get()
    if (!prod.exists) {
      throw new Error('Id não reconhecido.')
    }
    return prod.data()
  }

  async function salvar(root: any) {
    loading = true
    try {
      await db
        .collection('empresas')
        .doc(idEmpresa)
        .collection('produtos')
        .doc(id)
        .set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }

  const detUnico = det as any
  detUnico.maxOccurs = 1
  detUnico.annotation.label = "Informações do produto"
</script>

{#await carregar()}
  Carregando...
{:then root}
  {@debug root}
  <form on:submit|preventDefault={() => salvar(root)}>
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
            <a href={$url('../')} class="button is-danger"> Cancelar </a>
          </p>
        </div>
      </AutoForm>
    </fieldset>
  </form>
{/await}
