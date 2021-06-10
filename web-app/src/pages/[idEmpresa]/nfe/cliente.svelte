<script lang="ts">
  import { dbColumns } from '@app/store'
  import { dest } from '@form/data/nfe.json'
  import type INFeRoot from './INFeRoot';
  import Search from './_components/Search.svelte'

  export let scoped: INFeRoot
</script>

<Search
  coluna={$dbColumns.clientes}
  el={dest}
  nextName="Produtos"
  nextUrl="./produtos"
  previusName="Identificação"
  previusUrl="./identificacao"
  placeholder="Nome do cliente"
  root={scoped}
  updateRoot={(data) => scoped.dest = data.dest}
  wherePath="dest.xNome"
/>
