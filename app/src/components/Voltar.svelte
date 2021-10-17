<script>
  import { url } from '@roxi/routify'

  export let href = './'
</script>

<a href={$url(href)} title="Voltar">&#129092;</a>

<style>
  a {
    width: 6rem;
    margin-right: 1rem;
    display: inline-block;
    text-align: center;
  }
</style>
