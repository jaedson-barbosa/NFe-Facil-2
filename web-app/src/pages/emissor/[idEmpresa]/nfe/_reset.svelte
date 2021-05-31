<script lang="ts">
  import { isActive, url } from '@roxi/routify'
  import type INFeRoot from './INFeRoot'
  let commom: { root: INFeRoot } = { root: undefined }
</script>

{@debug commom}

{#if commom.root || $isActive('./index') || $isActive('./:id')}
  <slot scoped={{ commom }} />
{:else}
  Raiz inválida!
  <a href={$url('../nfes')}>Retornar</a>
{/if}
