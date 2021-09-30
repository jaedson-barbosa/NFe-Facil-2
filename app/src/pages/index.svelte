<script lang="ts">
  import { url } from '@roxi/routify'
  import { addMembro as _addMembro, defaultCatch } from '../code/firebase'
  import {
    edicao,
    permissaoAdministracao,
    permissaoEscrita,
    empresa,
    idEmpresa,
  } from '../code/store'

  $edicao = undefined

  function addMembro(escrita: boolean) {
    const idNovo = prompt('Id do novo membro')
    _addMembro({ CNPJ: $idEmpresa, escrita, idNovo })
      .then(() => alert('Registrado com sucesso.'))
      .catch(defaultCatch)
  }
</script>

<h1>Início</h1>
{#if permissaoAdministracao}
  <h3>Área do administrador</h3>
  <a class="button" href={$url('./emitente')}>Atualizar emitente</a>
  <a class="button" href={$url('./configuracoes')}>Configurações</a>
  <button on:click={() => addMembro(false)}>
    Adicionar membro somente leitura
  </button>
  <button on:click={() => addMembro(true)}>
    Adicionar membro leitura e escrita
  </button>
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

  <h3>Veículos</h3>
  {#if permissaoEscrita}
    <a class="button" href={$url('./veiculo')}>Adicionar</a>
  {/if}
  <a class="button" href={$url('./veiculos')}>Gerenciar</a>
  <p>
    Guardando as placas de todos os veículos que passarem pela sua empresa é
    possível diminuir a chance de erros de digitação.
  </p>
{:else}
  <strong>Cadastre as informações do emitente!</strong>
{/if}
