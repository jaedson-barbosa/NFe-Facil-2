<script lang="ts">
  import type { TColumn, TDocument } from '@app/store'
  import { url, goto } from '@roxi/routify'
  import { createId } from '@form/helpers'
  import AutoForm from '@form/AutoForm.svelte'

  export let coluna: TColumn
  export let placeholder: string
  export let previusUrl: string
  export let previusName: string
  export let nextUrl: string
  export let nextName: string
  export let wherePath: string
  export let el: any
  export let root: any
  export let updateRoot: (data: TDocument) => void
  export let onSubmit: () => void =  undefined

  let busca = ''
  let loading = false
  let options: { data: TDocument; label: string }[] = []

  async function buscar() {
    if (loading) return
    loading = true
    const queryResult = await coluna
      .limit(10)
      .where(wherePath, '>=', busca)
      .where(
        wherePath,
        '<',
        busca.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
      )
      .get()
    options = queryResult.docs.map((v) => {
      return {
        data: v.data(),
        label: v.get(wherePath),
      }
    })
    loading = false
  }

  $: appliedValue = !busca
  $: validValue = busca && options.some((v) => v.label == busca)

  function submit() {
    if (appliedValue) {
      onSubmit?.()
      $goto(nextUrl)
    } else if (validValue) {
      const option = options.find((v) => v.label == busca)
      updateRoot(option.data)
      busca = ''
    } else buscar()
  }

  const listId = createId()
</script>

<div class="container content box">
  <form on:submit|preventDefault={submit}>
    <div class="field">
      <div class="control is-expanded">
        <input
          class="input"
          type="text"
          list={listId}
          {placeholder}
          bind:value={busca}
        />
        <datalist id={listId}>
          {#each options as opt}
            <option>{opt.label}</option>
          {/each}
        </datalist>
      </div>
    </div>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url(previusUrl)} class="button is-warning">
          Voltar: {previusName}
        </a>
      </p>
      <slot />
      <p class="control">
        <button class="button is-primary" class:is-loading={loading}>
          {#if appliedValue}
            Próximo: {nextName}
          {:else if validValue}
            Selecionar
          {:else}
            Buscar
          {/if}
        </button>
      </p>
    </div>
    {#if !busca}
      <AutoForm {el} {root} />
    {/if}
  </form>
</div>
