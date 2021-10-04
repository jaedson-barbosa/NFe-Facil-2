<script lang="ts">
  export let href = '#add'
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a {href} on:click title="Adicionar">&#128932;</a>

<style>
  a {
    width: 5rem;
    display: inline-block;
    text-align: center;
  }
</style>
