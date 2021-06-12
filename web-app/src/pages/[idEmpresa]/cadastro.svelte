<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { emit } from '@form/data/nfe.json'
  import { empresa, idEmpresa, empresaRef } from '@app/store'
  import AutoForm from '@form/AutoForm.svelte'
  import InputT from '@form/InputT.svelte'

  let loading = false
  // Não podemos alterar o cadastro sem antes clicar em salvar
  $: root = $empresa ? { ...$empresa } : undefined

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

{#if root}
  <form on:submit|preventDefault={() => salvar(root)}>
    <fieldset disabled={loading}>
      <AutoForm el={emit} {root}>
        <InputT
          value={root.serieNFe}
          label="Série da NF-e"
          aux="Série atual de emissão das NF-es"
          pattern={'0|[1-9]{1}[0-9]{0,2}'}
        />
        <InputT
          value={root.serieNFCe}
          label="Série da NFC-e"
          aux="Série atual de emissão das NFC-es"
          pattern={'0|[1-9]{1}[0-9]{0,2}'}
        />
        <InputT
          value={root.IDCSC}
          label="ID CSC"
          aux="Identificador do CSC"
        />
        <InputT
          value={root.CSC}
          label="CSC"
          aux="Código de Segurança do Contribuinte"
        />
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
{/if}
