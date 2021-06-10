<script lang="ts">
  import { dbColumns } from '@app/store'
  import { det } from '@form/data/nfe.json'
  import { goto } from '@roxi/routify'
  import type INFeRoot from '../INFeRoot'
  import Search from '../_components/Search.svelte'

  export let scoped: INFeRoot
  export let edit: string

  let root: any = { det: scoped.det[+edit] }

  function remover() {
    scoped.det.splice(+edit, 1)
    $goto('../produtos')
  }

  const detUnico = det as any
  detUnico.maxOccurs = 1
  detUnico.annotation.label = 'Informações do produto'
</script>

<Search
  coluna={$dbColumns.produtos}
  el={detUnico}
  nextName="Produtos"
  nextUrl="../produtos"
  previusName="Produtos"
  previusUrl="../produtos"
  placeholder="Descrição"
  {root}
  updateRoot={(data) => (root = data)}
  onSubmit={() => (scoped.det[+edit] = root.det)}
  wherePath="det.prod.xProd"
>
  <p class="control">
    <button type="button" class="button is-danger" on:click={remover}>
      Remover
    </button>
  </p>
</Search>
