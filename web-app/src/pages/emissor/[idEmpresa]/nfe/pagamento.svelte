<script lang="ts">
  import { url, goto } from '@sveltech/routify'
  import { elementosNFe } from '@form/dataHelper'
  import AutoForm from '@form/AutoForm.svelte'
  import Readonly from '@form/Readonly.svelte'

  export let scoped: { commom: { root: any } }
  let root = scoped.commom.root
  $: rootRestante = {
    restante: (
      root.total.ICMSTot.vNF +
      +(root.pag.vTroco ?? 0) -
      (root.pag.detPag as any[]).reduce((p, c) => p + +(c.vPag ?? 0), 0)
    ).toFixed(2),
  }
  $: {
    console.log(rootRestante)
  }

  const infoRestante = {
    name: 'restante',
    annotation: {
      label: 'Valor restante',
      aux: 'Somatório deve ser igual a este valor para nota normal ou complementar.',
    },
  }
</script>

<form on:submit|preventDefault={$goto('../opcionais')}>
  <AutoForm el={elementosNFe[10]} bind:root>
    <Readonly el={infoRestante} root={rootRestante} />
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('../transporte')} class="button is-danger">
          Voltar: Transporte
        </a>
      </p>
      <p class="control">
        <button class="button is-primary"> Próximo: Opcionais </button>
      </p>
    </div>
  </AutoForm>
</form>
