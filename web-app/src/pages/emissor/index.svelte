<!-- Seleção de emitente -->
<script lang="ts">
  import { user } from '../../store'
  import { url } from '@sveltech/routify'
</script>

<div class="table-container">
  <table class:table={true} >
    <tr>
      <th>CNPJ</th>
      <th>Nome social</th>
      <th>Nome fantasia</th>
    </tr>
    <!-- Carregar emitentes na simples tabela -->
  </table>
</div>
