<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { createId } from '@form/helpers'
  import { db } from '@app/firebase'

  export let scoped: { commom: { root: any } }
  export let idEmpresa: string

  const root = scoped.commom.root
  const listId = createId()
  let options = []
  let busca = root.dest.xNome

  async function buscar() {
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

  $: appliedValue = busca && busca == root.dest.xNome
  $: validValue = busca && options.some((v) => v.text == busca)

  function submit() {
    if (appliedValue) {
      $goto('./produtos')
    } else if (validValue) {
      const option = options.find((v) => v.text == busca)
      const data = option.value.data()
      root.dest = data.dest
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
          placeholder="Nome"
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
        <a href={$url('./identificacao')} class="button is-danger">
          Voltar: Identificação
        </a>
      </p>
      <p class="control">
        <button class="button is-primary">
          {#if appliedValue}
            Próximo: Produtos
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
