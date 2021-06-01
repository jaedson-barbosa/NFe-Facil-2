<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { emit } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'
  import Input from '@form/Input.svelte'

  export let scoped: { idEmpresa: string }

  const infoSerie = {
    name: 'serieNFe',
    annotation: {
      label: 'Série da NF-e',
      aux: 'Série atual de emissão das NF-es',
    },
    restriction: { pattern: '0|[1-9]{1}[0-9]{0,2}' },
  }

  async function carregar() {
    const empresa = await db.collection('empresas').doc(scoped.idEmpresa).get()
    if (!empresa.exists) {
      throw new Error('CNPJ não cadastrado.')
    }
    return empresa.data()
  }

  let loading = false

  async function salvar(root: any) {
    loading = true
    try {
      await db.collection('empresas').doc(scoped.idEmpresa).update(root)
      $goto('./')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

{#await carregar()}
  Carregando...
{:then root}
  {@debug root}
  <form on:submit|preventDefault={() => salvar(root)}>
    <fieldset disabled={loading}>
      <AutoForm el={emit} {root}>
        <Input {root} el={infoSerie} />
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
            <a href={$url('./')} class="button is-danger"> Cancelar </a>
          </p>
        </div>
      </AutoForm>
    </fieldset>
  </form>
{/await}
