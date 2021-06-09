<script lang="ts">
  import { empresa, idEmpresa as idEmpresaStore } from '@app/store'

  // Caso seja uma mudança de emitente, o antigo não será carregado
  $idEmpresaStore = ''
  export let idEmpresa: string;
  $idEmpresaStore = idEmpresa
</script>

{#if empresa}
  <slot />
{/if}
