<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { emit } from '@form/data/nfe.json'
  import { empresa, idEmpresa, empresaRef } from '@app/store'
  import AutoForm from '@form/AutoForm.svelte'
  import Input from '@form/Input.svelte'

  const infoSerie = {
    name: 'serieNFe',
    annotation: {
      label: 'Série da NF-e',
      aux: 'Série atual de emissão das NF-es',
    },
    restriction: { pattern: '0|[1-9]{1}[0-9]{0,2}' },
  }

  let loading = false
  let root = $empresa

  async function salvar(root: any) {
    loading = true
    try {
      if (root.emit.CNPJ != $idEmpresa) {
        alert('Não é permitida a alteração do CNPJ do emitente.')
        return
      }
      await $empresaRef.update(root)
      $goto('./')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

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
          <a href={$url('./')} class="button is-danger"> Cancelar </a>
        </p>
      </div>
    </AutoForm>
  </fieldset>
</form>
