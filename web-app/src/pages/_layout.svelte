<!-- routify:options bundle=true -->
<!-- A opção acima ativa o bundle pra todos os filhos deste layout -->
<script>
  import { url } from '@sveltech/routify'
</script>

<nav>
  <a href={$url('/')} title="Home">Home</a>
  <a href={$url('./about')} title="About">About</a>
</nav>

<slot />
