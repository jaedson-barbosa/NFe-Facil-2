<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import {
    retirada,
    entrega,
    autXML,
    cobr,
    infIntermed,
    infAdic,
    exporta,
    compra,
    cana,
  } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'

  export let scoped: { commom: { root: any } }

  const el = {
    annotation: { label: 'Campos opcionais' },
    element: [
      retirada,
      entrega,
      autXML,
      cobr,
      infIntermed,
      infAdic,
      exporta,
      compra,
      cana,
    ],
  }
</script>

<form on:submit|preventDefault={$goto('./final')}>
  <AutoForm {el} root={scoped.commom.root}>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('./pagamento')} class="button is-danger">
          Voltar: Pagamento
        </a>
      </p>
      <p class="control">
        <button class="button is-primary"> Finalizar </button>
      </p>
    </div>
  </AutoForm>
</form>
