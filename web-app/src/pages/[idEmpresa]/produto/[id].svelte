<script lang="ts">
  import { params, url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { det } from '@form/data/nfe.json'
  import { createId } from '@form/helpers'
  import AutoForm from '@form/AutoForm.svelte'

  export let id: string
  const idEmpresa = $params['idEmpresa']

  let loading = false
  let root: any

  db.collection('empresas')
    .doc(idEmpresa)
    .collection('produtos')
    .doc(id)
    .get()
    .then((prod) => {
      if (!prod.exists) {
        alert('Id não reconhecido.')
        $goto('../')
      }
      root = prod.data()
    })

  async function salvar() {
    loading = true
    try {
      const det = root.det
      const _id = det.prod.cProd
      if (_id != id) {
        alert('Não é permitido alterar o código de um produto cadastrado.')
        return
      }
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
  detUnico.annotation.label = 'Informações do produto'
</script>

{#if root}
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
            <a href={$url('../')} class="button is-danger"> Cancelar </a>
          </p>
        </div>
      </AutoForm>
    </fieldset>
  </form>
{/if}
