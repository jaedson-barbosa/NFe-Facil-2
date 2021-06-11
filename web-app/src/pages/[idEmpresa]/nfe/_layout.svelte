<script lang="ts">
  import { isActive, url } from '@roxi/routify'
  import type INFeRoot from './INFeRoot'

  function updateScoped(root: INFeRoot) {
    scoped = root
  }

  let scoped: any = { updateScoped }

  $: isInitial = $isActive('./index') || $isActive('./:id')

  $: {
    if (isInitial) scoped = { updateScoped }
  }
</script>

{@debug scoped}

{#if scoped.ide || isInitial}
  <slot {scoped} />
{:else}
  Raiz inválida!
  <a href={$url('../')}>Retornar</a>
{/if}
