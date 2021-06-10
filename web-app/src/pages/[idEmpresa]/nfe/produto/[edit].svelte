<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { det } from '@form/data/nfe.json'
  import Elements from '@form/Elements.svelte'
  import type INFeRoot from '../INFeRoot'

  export let scoped: INFeRoot
  export let edit: string

  const root = { det: scoped.det[+edit] }

  function submit() {
    scoped.det[+edit] = root.det
    $goto('../produtos')
  }

  function remover() {
    scoped.det.splice(+edit, 1)
    $goto('../produtos')
  }

  const detUnico = det as any
  detUnico.maxOccurs = 1
  detUnico.annotation.label = 'Informações do produto'
</script>

<div class="container content box">
  <form on:submit|preventDefault={submit}>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <button type="button" class="button is-danger" on:click={remover}>
          Remover
        </button>
      </p>
      <p class="control">
        <a href={$url('../produtos')} class="button"> Cancelar </a>
      </p>
      <p class="control">
        <button class="button is-primary"> Salvar </button>
      </p>
    </div>
    <Elements el={detUnico} {root} />
  </form>
</div>
