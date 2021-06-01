<script lang="ts">
  import NFEs from './_components/NFEs.svelte'

  export let scoped: {idEmpresa: string};
</script>

<NFEs coluna="notasEmitidas" idEmpresa={scoped.idEmpresa} />
