<script lang="ts">
  import { url, goto } from '@sveltech/routify'
  import { createId } from '@form/formElements/helpers'
  import { db } from '@app/firebase'
  import AutoForm from '@form/AutoForm.svelte'
  import { elementosNFe } from '@form/dataHelper';

  export let scoped: { commom: { root: any } }
  export let idEmpresa: string

  let root = scoped.commom.root
  const listId = createId()
  let options = []
  let busca = ''

  async function buscar() {
    const queryResult = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('transportes')
      .where('identificador', '>=', busca)
      .where(
        'identificador',
        '<',
        busca.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
      )
      .limit(10)
      .get()
    options = queryResult.docs.map((v) => {
      return {
        value: v,
        text: v.get('identificador'),
      }
    })
  }

  let lastAppliedValue = ''
  $: appliedValue = !busca || appliedValue == busca
  $: validValue = busca && options.some((v) => v.text == busca)

  function submit() {
    if (appliedValue) {
      $goto('../pagamento')
    } else if (validValue) {
      const option = options.find((v) => v.text == busca)
      const data = option.value.data()
      lastAppliedValue = data.identificador
      root.transp = data.transp
      root = root
    } else buscar()
  }
</script>

<div class="container content box">
  <form on:submit|preventDefault={submit}>
    <div class="field">
      <div class="control is-expanded">
        <input
          class="input"
          type="text"
          list={listId}
          placeholder="Identificador"
          bind:value={busca}
        />
        <datalist id={listId}>
          {#each options as opt}
            <option>{opt.text}</option>
          {/each}
        </datalist>
      </div>
    </div>
    <AutoForm el={elementosNFe[8]} {root} />
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('../total')} class="button is-danger">
          Voltar: Totais
        </a>
      </p>
      <p class="control">
        <button class="button is-primary">
          {#if appliedValue}
            Próximo: Pagamento
          {:else if validValue}
            Selecionar
          {:else}
            Buscar
          {/if}
        </button>
      </p>
    </div>
  </form>
</div>
