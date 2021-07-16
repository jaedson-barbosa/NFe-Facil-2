<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { ide } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'
  import SelectV from '@form/SelectV.svelte'
  import type INFeRoot from './INFeRoot'
  import { isCnpjValid, isCpfValid } from '@app/documentUtils'

  export let scoped: INFeRoot

  $: isNFCe = scoped.ide.mod == 65

  let tipoClienteNFCe = '0'

  function submit() {
    if (tipoClienteNFCe == '2') {
      scoped.dest = ''
      $goto('./produtos')
    } else if (tipoClienteNFCe == '1') {
      const doc = prompt('CPF, CNPJ ou idEstrangeiro.')
      const onlyNumbers = /\d+/g.test(doc)
      if (onlyNumbers && doc.length == 11 && isCpfValid(doc)) {
        scoped.dest = { CPF: doc }
        $goto('./produtos')
      } else if (onlyNumbers && doc.length == 14 && isCnpjValid(doc)) {
        scoped.dest = { CNPJ: doc }
        $goto('./produtos')
      } else {
        if (
          confirm(
            'Documento não se encaixa nem como CPF nem como CNPJ. Confirme caso se trate de um identificador estrangeiro, caso contrário, clique em cancelar e tente novamente usando um CPF ou CNPJ válido.'
          )
        ) {
          scoped.dest = { idEstrangeiro: doc }
          $goto('./produtos')
        }
      }
    } else {
      if (!scoped.dest) scoped.dest = {}
      $goto('./cliente')
    }
  }
</script>

<form on:submit|preventDefault={submit}>
  <AutoForm el={ide} root={scoped}>
    {#if isNFCe}
      <SelectV
        label="Cliente da NFC-e"
        options={[
          { value: '0', text: 'Completo' },
          { value: '1', text: 'Simplificado' },
          { value: '2', text: 'Sem cliente' },
        ]}
        required={true}
        bind:value={tipoClienteNFCe}
      />
    {/if}
    <a href={$url('../')} class="button"> Voltar: Excluir </a>
    <button>
      {#if tipoClienteNFCe == '2'}
        Próximo: Produtos
      {:else}
        Próximo: Cliente
      {/if}
    </button>
  </AutoForm>
</form>
