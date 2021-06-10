<script lang="ts">
  import { isActive, url } from '@roxi/routify'

  // Usar esse aqui e criar uma interface para ajudar nisso
  let scoped: any = { }
</script>

{#if scoped.ide || $isActive('./index') || $isActive('./:id')}
  <slot {scoped} />
{:else}
  Raiz inválida!
  <a href={$url('../')}>Retornar</a>
{/if}
