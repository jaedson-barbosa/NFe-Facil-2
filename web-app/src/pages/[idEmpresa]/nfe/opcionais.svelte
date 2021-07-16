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
  import type INFeRoot from './INFeRoot'

  export let scoped: INFeRoot

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
  <AutoForm {el} root={scoped}>
    <a href={$url('./pagamento')} class="button"> Voltar: Pagamento </a>
    <button> Finalizar </button>
  </AutoForm>
</form>
