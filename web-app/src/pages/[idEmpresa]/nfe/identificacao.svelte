<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { elementosNFe } from '@form/dataHelper'
  import AutoForm from '@form/AutoForm.svelte'

  export let scoped: { commom: { root: any } }
</script>

<form on:submit|preventDefault={$goto('./cliente')}>
  <AutoForm el={elementosNFe[0]} root={scoped.commom.root}>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('../nfes')} class="button is-danger">Voltar: Excluir</a>
      </p>
      <p class="control">
        <button class="button is-primary"> Próximo: Cliente </button>
      </p>
    </div>
  </AutoForm>
</form>
