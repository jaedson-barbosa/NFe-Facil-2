<script lang="ts">
  import { params, url, goto  } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { transp } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'

  export let id: string
  $: idEmpresa = $params['idEmpresa']

  let loading = false

  async function carregar() {
    const mot = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('transportes')
      .doc(id)
      .get()
    if (!mot.exists) throw new Error('Id não reconhecido.')
    return mot.data()
  }

  async function salvar(root: any) {
    loading = true
    try {
      const transporta = root.transporta
      const _id = transporta.CPF ? transporta.CPF : transporta.CNPJ
      if (_id != id) {
        alert('Não é permitido alterar o documento de um cliente cadastrado.')
        return
      }
      await db
        .collection('empresas')
        .doc(idEmpresa)
        .collection('transportes')
        .doc(id)
        .set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }

  const transporta = transp.element[1]
  transporta.optional = false
</script>

{#await carregar()}
  Carregando...
{:then root}
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
{/await}
