<script lang="ts">
  import { params } from '@sveltech/routify'
  import { url, goto } from '@sveltech/routify'
  import { db } from '@app/firebase'
  import { elementosNFe } from '@form/dataHelper'
  import AutoForm from '@form/AutoForm.svelte'

  export let id: string
  $: idEmpresa = $params['idEmpresa']

  let loading = false

  async function carregar() {
    const mot = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('motoristas')
      .doc(id)
      .get()
    if (!mot.exists) {
      throw new Error('Id não reconhecido.')
    }
    return mot.data()
  }

  async function salvar(root: any) {
    loading = true
    try {
      await db
        .collection('empresas')
        .doc(idEmpresa)
        .collection('motoristas')
        .doc(id)
        .set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }

  const motObrigatorio = elementosNFe[8]['element'][1]
  motObrigatorio.optional = false
</script>

{#await carregar()}
  Carregando...
{:then root}
  {@debug root}
  <form on:submit|preventDefault={() => salvar(root)}>
    <fieldset disabled={loading}>
      <AutoForm el={motObrigatorio} {root}>
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
