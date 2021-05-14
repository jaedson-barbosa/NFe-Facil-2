<script>
  import Login from './Login.svelte'
  let name = 'FireSvelte 🔥'
</script>

<main class="content">
  <h1>Welcome to {name}!</h1>
  <Login />
</main>

<style>
  h1 {
    color: purple;
  }
  main {
    margin: 20px;
  }
</style>
