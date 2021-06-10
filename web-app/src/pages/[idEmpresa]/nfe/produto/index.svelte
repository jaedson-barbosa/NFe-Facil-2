<script lang="ts">
  import { dbColumns } from '@app/store'
  import { det } from '@form/data/nfe.json'
  import type INFeRoot from '../INFeRoot'
  import Search from '../_components/Search.svelte'

  export let scoped: INFeRoot

  let root: any = { det: {} }

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
  updateRoot={(data) => root = data}
  onSubmit={() => scoped.det.push(root.det)}
  wherePath="det.prod.xProd"
/>
