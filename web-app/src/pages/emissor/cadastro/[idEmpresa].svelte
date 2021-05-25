<script lang="ts">
  import { url, goto } from '@sveltech/routify'
  import { db } from '@app/firebase'
  import { elementosNFe } from '@form/dataHelper'
  import AutoForm from '@form/AutoForm.svelte'
  import Input from '@form/Input.svelte'

  export let idEmpresa: string

  const infoSerie = {
    name: 'serieNFe',
    annotation: {
      label: 'Série da NF-e',
      aux: 'Série atual de emissão das NF-es',
    },
    restriction: { pattern: '0|[1-9]{1}[0-9]{0,2}' },
  }

  async function carregar() {
    const empresa = await db.collection('empresas').doc(idEmpresa).get()
    if (!empresa.exists) {
      throw new Error('CNPJ não cadastrado.');
    }
    return empresa.data()
  }

  let loading = false

  async function salvar(root: any) {
    loading = true
    try {
      await db.collection('empresas').doc(idEmpresa).update(root)
      $goto('../../:idEmpresa', { idEmpresa })
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
    <AutoForm el={elementosNFe[1]} {root}>
      <Input {root} el={infoSerie} />
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button
            class="button is-primary"
            class:is-loading={loading}
          >
            Salvar
          </button>
        </p>
        <p class="control">
          <button type="reset" class="button is-warning"> Limpar </button>
        </p>
        <p class="control">
          <a href={$url('..')} class="button is-danger"> Cancelar </a>
        </p>
      </div>
    </AutoForm>
  </fieldset>
</form>
{/await}
