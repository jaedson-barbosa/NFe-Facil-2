<script lang="ts">
  import { dbColumns } from '@app/store'
  import { transp } from '@form/data/nfe.json'
  import type INFeRoot from './INFeRoot'
  import Search from './_components/Search.svelte'

  export let scoped: INFeRoot
</script>

<Search
  coluna={$dbColumns.transportes}
  el={transp}
  nextName="Pagamento"
  nextUrl="./pagamento"
  previusName="Totais"
  previusUrl="./total"
  placeholder="Nome do transportador"
  root={scoped}
  updateRoot={(data) => scoped.transp.transporta = data.transporta}
  wherePath="transporta.xNome"
/>
