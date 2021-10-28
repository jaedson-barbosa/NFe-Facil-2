<script lang="ts">
  export let href = '#add'
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a {href} on:click title="Adicionar">
  <img src="icons/iconmonstr-plus-1.svg" alt="Símbolo de soma" />
</a>

<style>
  a {
    width: 6rem;
    display: inline-block;
    text-align: center;
  }

  img {
    height: 0.8em;
    transform: scaleX(-1);
  }
</style>
