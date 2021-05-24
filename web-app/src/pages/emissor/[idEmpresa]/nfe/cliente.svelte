<script lang="ts">
  import { url, goto } from '@sveltech/routify'
  import { elementosNFe } from '@form/dataHelper'
  import AutoForm from '@form/AutoForm.svelte'
  import { createId } from '@form/formElements/helpers'
  import { db } from '@app/firebase'
import { init } from 'svelte/internal';

  export let scoped: { commom: { root: any } }
  export let idEmpresa: string

  const listId = createId()
  let options = []

  let showModal = false
  let busca = ''

  async function buscar() {
    alert('Busca!')
    const queryResult = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('clientes')
      .where('dest.xNome', '>=', busca)
      .where(
        'dest.xNome',
        '<',
        busca.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
      )
      .limit(10)
      .get()
    options = queryResult.docs.map((v) => {
      return {
        value: v,
        text: v.get('dest.xNome'),
      }
    })
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function awaitStop(initialValue: string) {
    if (!initialValue) return
    await sleep(3000)
    if (busca == initialValue) buscar()
  } //Testar, aplicar readonly nos controles da identificação

  $: {
    awaitStop(busca)
  }
</script>

<form on:submit|preventDefault={$goto('./cliente')}>
  <AutoForm el={elementosNFe[2]} root={scoped.commom.root}>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('../../')} class="button is-danger">Voltar: Excluir</a>
      </p>
      <p class="control">
        <button class="button is-primary"> Próximo: Cliente </button>
      </p>
    </div>
  </AutoForm>
</form>

<div class="modal" class:is-active={showModal}>
  <div class="modal-background" />
  <div class="modal-content">
    <div class="container content box">
      <form
        on:submit|preventDefault={() => {
          const option = options.find((v) => v.text == busca)
          if (option) {
            scoped.commom.root.dest = option.value.data()
            showModal = false
          } else {
            alert('Selecione um valor válido!')
          }
        }}
      >
        <div class="field">
          <div class="control is-expanded">
            <input
              class="input"
              type="text"
              list={listId}
              placeholder="Nome"
              bind:value={busca}
            />
            <datalist id={listId}>
              {#each options as opt}
                <option>{opt.text}</option>
              {/each}
            </datalist>
          </div>
          <p class="help">
            Digite e aguarde 3 segundos para que a pesquisa seja feita./p>
          </p>
        </div>
        <div class="buttons is-centered">
          <button class="button is-primary">Salvar</button>
          <button
            type="button"
            class="button is-danger"
            on:click={() => (showModal = false)}>Cancelar</button
          >
        </div>
      </form>
    </div>
  </div>
</div>
