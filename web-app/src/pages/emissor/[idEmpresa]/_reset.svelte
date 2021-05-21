<script lang="ts">
  import { url } from '@sveltech/routify'
  
  export let idEmpresa: string;
</script>
<!-- Pôr produtos -->
<nav>
  <a href={$url('./')}>Resumo</a>
  <a href={$url('./clientes')}>Clientes</a>
  <a href={$url('./motoristas')}>Motoristas</a>
  <a href={$url('./produtos')}>Produtos</a>
  <a href={$url('../')}>Sair</a>
</nav>
<slot scoped={{idEmpresa}} />
