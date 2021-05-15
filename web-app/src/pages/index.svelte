<script>
  import { url } from '@sveltech/routify'
</script>

<main class="content">
  <h1>Bem vindo ao NFe Fácil</h1>
  <a href={$url('./emissor')}>Abrir emissor</a>
</main>

<style>
  h1 {
    color: purple;
  }
  main {
    margin: 20px;
  }
</style>
