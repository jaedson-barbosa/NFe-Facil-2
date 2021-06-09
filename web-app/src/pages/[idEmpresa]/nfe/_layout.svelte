<script lang="ts">
  import { isActive, url } from '@roxi/routify'
  import type INFeRoot from './INFeRoot'

  // Usar esse aqui e criar uma interface para ajudar nisso
  let commom: { root: INFeRoot } = { root: undefined }
</script>

{@debug commom}

{#if commom.root || $isActive('./index') || $isActive('./:id')}
  <slot scoped={{ commom }} />
{:else}
  Raiz inválida!
  <a href={$url('../')}>Retornar</a>
{/if}
