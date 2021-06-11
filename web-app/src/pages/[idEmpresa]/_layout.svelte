<script lang="ts">
  import { empresa, idEmpresa as idEmpresaStore } from '@app/store'

  export let idEmpresa: string;

  if (idEmpresa != $idEmpresaStore) {
    $idEmpresaStore = idEmpresa
  }
</script>

{#if empresa}
  <slot />
{/if}
