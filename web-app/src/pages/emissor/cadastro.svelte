<script lang="ts">
  import { url } from '@sveltech/routify'
  import { db } from '@app/firebase'
  import { elementosNFe } from '@form/dataHelper'
  import AutoForm from '@form/AutoForm.svelte'
  import Input from '@form/formElements/Input.svelte'

  const infoSerie = {
    annotation: {
      label: 'Série da NF-e',
      aux: 'Série atual de emissão das NF-es',
    },
    restriction: { pattern: '0|[1-9]{1}[0-9]{0,2}' },
  }

  const root = {
    serieNFe: '1',
  }

  let loading = false

  function salvar() {}
</script>

{@debug root}
<form class="block">
  <fieldset disabled={loading}>
    <AutoForm el={elementosNFe[1]} {root}>
      <Input bind:value={root.serieNFe} el={infoSerie} />
      <div class="field is-grouped is-grouped-centered">
        <p class="control">
          <button
            class="button is-primary"
            class:is-loading={loading}
            on:click={salvar}
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
