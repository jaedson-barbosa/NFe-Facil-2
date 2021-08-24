<script>
  import { Router } from '@roxi/routify'
  import { routes } from '../.routify/routes'
</script>

<Router {routes} />

<style global>
  tbody > tr.clicavel {
    cursor: pointer;
  }

  tbody > tr.marcado {
    background-color: #e1e1e1;
  }
</style>