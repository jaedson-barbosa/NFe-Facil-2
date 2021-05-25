<script lang="ts">
  import { url, goto } from '@sveltech/routify'
  import { elementosNFe } from '@form/dataHelper'
  import AutoForm from '@form/AutoForm.svelte'

  export let scoped: { commom: { root: any } }

  const el = {
    annotation: { label: 'Campos opcionais' },
    element: [
      elementosNFe[3],
      elementosNFe[4],
      elementosNFe[5],
      elementosNFe[9],
      elementosNFe[11],
      elementosNFe[12],
      elementosNFe[13],
      elementosNFe[14],
      elementosNFe[15],
    ],
  }
</script>

<form on:submit|preventDefault={$goto('../final')}>
  <AutoForm {el} root={scoped.commom.root}>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('../pagamento')} class="button is-danger">
          Voltar: Pagamento
        </a>
      </p>
      <p class="control">
        <button class="button is-primary"> Finalizar </button>
      </p>
    </div>
  </AutoForm>
</form>
