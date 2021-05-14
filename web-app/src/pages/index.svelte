<script>
  import Todos from './Todos.svelte';
  
  export let scoped
  $: ({ user } = scoped)
</script>

<main class="content">
  <h1>Bem vindo ao NFe Fácil, {user.displayName}</h1>
  <Todos uid={user.uid} />
</main>

<style>
  h1 {
    color: purple;
  }
  main {
    margin: 20px;
  }
</style>
