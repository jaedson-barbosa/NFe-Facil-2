<script lang="ts">
  import { url } from '@sveltech/routify'
  
  export let idEmpresa: string;
</script>

<nav>
  <a href={$url('./')}>Resumo</a>
  <a href={$url('./clientes')}>Clientes</a>
  <a href={$url('../')}>Sair</a>
</nav>
<slot scoped={{idEmpresa}} />
