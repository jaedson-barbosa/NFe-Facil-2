<script lang="ts">
  import { isActive, url } from '@sveltech/routify'
  let commom = {
    root: undefined
  } // Um root comum a todas as paginas
</script>

{@debug commom}

{#if commom.root || $isActive('./index')}
<slot scoped={{commom}} />
{:else}
Raiz inválida!
<a href={$url('../nfes')}>Retornar</a>
{/if}
