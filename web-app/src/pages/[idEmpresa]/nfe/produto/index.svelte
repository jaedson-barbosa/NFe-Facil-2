<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { createId } from '@form/helpers'
  import type INFeRoot from '../INFeRoot'

  export let scoped: { commom: { root: INFeRoot } }
  export let idEmpresa: string

  const root = { det: {} }

  const listId = createId()
  let options = []
  let busca = ''

  async function buscar() {
    const queryResult = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('produtos')
      .where('det.prod.xProd', '>=', busca)
      .where(
        'det.prod.xProd',
        '<',
        busca.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
      )
      .limit(10)
      .get()
    options = queryResult.docs.map((v) => {
      return {
        value: v,
        text: v.get('det.prod.xProd'),
      }
    })
    console.log(options)
  }

  $: validValue = busca && options.some((v) => v.text == busca)

  function submit() {
    if (validValue) {
      const option = options.find((v) => v.text == busca)
      const data = option.value.data()
      const newLength = scoped.commom.root.det.push(data.det)
      $goto('./:edit', { edit: newLength - 1 })
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
          placeholder="Descrição"
          bind:value={busca}
        />
        <datalist id={listId}>
          {#each options as opt}
            <option>{opt.text}</option>
          {/each}
        </datalist>
      </div>
    </div>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('../produtos')} class="button is-danger"> Cancelar </a>
      </p>
      <p class="control">
        <button class="button is-primary">
          {#if validValue}
            Selecionar
          {:else}
            Buscar
          {/if}
        </button>
      </p>
    </div>
  </form>
</div>
