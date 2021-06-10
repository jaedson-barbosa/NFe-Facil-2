<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { pag } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'
  import Readonly from '@form/Readonly.svelte'
  import type INFeRoot from './INFeRoot';

  export let scoped: INFeRoot
  $: rootRestante = {
    restante: (
      scoped.total.ICMSTot.vNF +
      +(scoped.pag.vTroco ?? 0) -
      (scoped.pag.detPag as any[]).reduce((p, c) => p + +(c.vPag ?? 0), 0)
    ).toFixed(2),
  }

  const infoRestante = {
    name: 'restante',
    annotation: {
      label: 'Valor restante',
      aux: 'Somatório deve ser igual a este valor para nota normal ou complementar.',
    },
  }
</script>

<form on:submit|preventDefault={$goto('./opcionais')}>
  <AutoForm el={pag} root={scoped}>
    <Readonly el={infoRestante} root={rootRestante} />
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('./transporte')} class="button is-danger">
          Voltar: Transporte
        </a>
      </p>
      <p class="control">
        <button class="button is-primary"> Próximo: Opcionais </button>
      </p>
    </div>
  </AutoForm>
</form>
