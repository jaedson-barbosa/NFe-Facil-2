<script lang="ts">
  import { url } from '@sveltech/routify'
  
  export let idEmpresa: string;
</script>

<nav>
  <a href={$url('./')}>Resumo</a>
  <a href={$url('./clientes')}>Clientes</a>
  <a href={$url('./transporte')}>Motoristas</a>
  <a href={$url('./produtos')}>Produtos</a>
  <a href={$url('./nfes')}>Notas</a>
  <a href={$url('../')}>Sair</a>
</nav>
<slot scoped={{idEmpresa}} />
