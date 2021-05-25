<script lang="ts">
  import { isActive, url } from '@sveltech/routify'
  import type { INFeRoot } from './rootGenerator'
  let commom: { root: INFeRoot } = { root: undefined }
</script>

{@debug commom}

{#if commom.root || $isActive('./index')}
  <slot scoped={{ commom }} />
{:else}
  Raiz inválida!
  <a href={$url('../nfes')}>Retornar</a>
{/if}
