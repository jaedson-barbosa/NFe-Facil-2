<script lang="ts">
  import { url } from '@roxi/routify'
  import {
    edicao,
    permissaoAdministracao,
    permissaoEscrita,
    empresa,
  } from '../code/store'

  $edicao = undefined
</script>

<h1>Início</h1>
{#if permissaoAdministracao}
  <h3>Área do administrador</h3>
  <a class="button" href={$url('./emitente')}>Atualizar emitente</a>
  <a class="button" href={$url('./configuracoes')}>Configurações</a>
  <p>
    Mantenha todos os dados do emitente atualizados e personalize tudo de acordo
    com as suas necessidades e preferências.
  </p>
{/if}

{#if $empresa.emit.enderEmit}
  <h3>NF-es e NFC-es</h3>
  {#if permissaoEscrita}
    <a class="button" href={$url('./nfe')}>Adicionar</a>
    <a class="button" href={$url('./importacao')}>Importar</a>
  {/if}
  <a class="button" href={$url('./nfes')}>Gerenciar</a>
  <p>
    Emita notas fiscais em produção, aprenda emitindo em homologação, passe
    orçamentos com notas sem valor fiscal e importe notas fiscais de saída
    emitidas em qualquer emissor.
  </p>

  <h3>Clientes</h3>
  {#if permissaoEscrita}
    <a class="button" href={$url('./cliente')}>Adicionar</a>
  {/if}
  <a class="button" href={$url('./clientes')}>Gerenciar</a>
  <p>
    Para garantir boas práticas, para a emissão de NF-es só é possível inserir
    clientes previamente cadastrados.
  </p>

  <h3>Produtos</h3>
  {#if permissaoEscrita}
    <a class="button" href={$url('./produto')}>Adicionar</a>
  {/if}
  <a class="button" href={$url('./produtos')}>Gerenciar</a>
  <p>
    Os produtos junto com os impostos são uma das partes mais complexas do
    emissor, então crie quantas cópias forem necessárias.
  </p>

  <h3>Transportadores</h3>
  {#if permissaoEscrita}
    <a class="button" href={$url('./transporta')}>Adicionar</a>
  {/if}
  <a class="button" href={$url('./transportes')}>Gerenciar</a>
  <p>
    Aqui também é seguida a boa prática somente permitir a inserção de
    transportadores previamente cadastrados.
  </p>
{:else}
  <strong>Cadastre as informações do emitente!</strong>
{/if}
