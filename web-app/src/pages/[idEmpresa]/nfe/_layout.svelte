<script lang="ts">
  import { isActive, url } from '@roxi/routify'
  import type INFeRoot from './INFeRoot'

  export let scoped: { idEmpresa: string }

  // Usar esse aqui e criar uma interface para ajudar nisso
  let commom: { root: INFeRoot, idEmpresa: string } = { root: undefined, idEmpresa: scoped.idEmpresa }
</script>

{@debug commom}

{#if commom.root || $isActive('./index') || $isActive('./:id')}
  <slot scoped={{ commom }} />
{:else}
  Raiz inválida!
  <a href={$url('../')}>Retornar</a>
{/if}
