<script>
  import { url } from '@roxi/routify'

  export let href = './'
</script>

<a href={$url(href)} title="Voltar">
  <img src="icons/iconmonstr-arrow-20.svg" alt="Seta para esquerda" />
</a>

<style>
  a {
    width: 6rem;
    margin-right: 1rem;
    display: inline-block;
    text-align: center;
  }

  img {
    height: 0.8em;
    transform: scaleX(-1);
  }
</style>
