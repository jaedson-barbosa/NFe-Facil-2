<script lang="ts">
  import { dbColumns } from '@app/store'
  import type { IScoped } from './IScoped'
  import Resumo from './_components/Resumo.svelte'

  export let scoped: IScoped
</script>

<Resumo coluna={$dbColumns.notasCSalvas} isNFCe={true} {scoped} />
