<script lang="ts">
  export let scoped: { idEmpresa: string }
  $: ({ idEmpresa } = scoped)
</script>

<h1>{idEmpresa}</h1>
