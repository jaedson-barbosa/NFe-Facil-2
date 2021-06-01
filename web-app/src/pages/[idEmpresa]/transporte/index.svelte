<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { transp } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'
  import Input from '@form/Input.svelte'

  export let idEmpresa: string

  const infoIdentificador = {
    name: 'identificador',
    annotation: {
      label: 'Identificador',
      aux: 'Identificação deste grupo de transporte, ex.: nome do motorista',
    },
    restriction: { minLength: 4 },
  }

  let loading = false
  const root = {
    identificador: '',
    transp: {}
  }

  async function salvar() {
    loading = true
    try {
      await db
        .collection('empresas')
        .doc(idEmpresa)
        .collection('transportes')
        .add(root)
      $goto('../transportes')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

{@debug root}
<form on:submit|preventDefault={salvar}>
  <fieldset disabled={loading}>
    <AutoForm el={transp} {root}>
      <Input {root} el={infoIdentificador} />
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
          <a href={$url('../transportes')} class="button is-danger"> Cancelar </a>
        </p>
      </div>
    </AutoForm>
  </fieldset>
</form>
