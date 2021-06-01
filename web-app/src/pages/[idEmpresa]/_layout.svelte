<script lang="ts">
  import { url } from '@roxi/routify'
  
  export let idEmpresa: string;
</script>

<nav>
  <a href={$url('./')}>Resumo</a>
  <a href={$url('./cadastro')}>Editar cadastro</a>
  <a href={$url('./clientes')}>Clientes</a>
  <a href={$url('./transportes')}>Transportes</a>
  <a href={$url('./produtos')}>Produtos</a>
  <a href={$url('./nfesEmitidas')}>Notas emitidas</a>
  <a href={$url('./nfesSalvas')}>Notas salvas</a>
  <a href={$url('../')}>Sair</a>
</nav>
<slot scoped={{idEmpresa}} />
