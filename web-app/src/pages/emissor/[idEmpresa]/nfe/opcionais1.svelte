<script lang="ts">
  import { url, goto } from '@sveltech/routify'
  import { elementosNFe } from '@form/dataHelper'
  import AutoForm from '@form/AutoForm.svelte'

  export let scoped: { commom: { root: any } }

  const el = {
    annotation: { label: "1º grupo de opcionais" },
    element: [
      elementosNFe[3],
      elementosNFe[4],
      elementosNFe[5],
    ]
  }
</script>

<form on:submit|preventDefault={$goto('../produtos')}>
  <AutoForm {el} root={scoped.commom.root}>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('../cliente')} class="button is-danger">Voltar: Cliente</a>
      </p>
      <p class="control">
        <button class="button is-primary"> Próximo: Produtos </button>
      </p>
    </div>
  </AutoForm>
</form>
