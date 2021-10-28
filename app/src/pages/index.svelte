<script lang="ts">
  import { url } from '@roxi/routify'
  import { edicao, liberacoes, idEmpresa, empresa } from '../code/store'
  import { NiveisAcesso } from '../code/tipos'
  import Ajuda from '../components/Ajuda.svelte'

  $edicao = undefined
  $: pronto = $empresa.emit.enderEmit && $empresa.tokenIBPT
  $: liberacao = $liberacoes?.find((v) => v.cnpj == idEmpresa)?.nivel

  const titleIBPT = 'Instituto Brasileiro de Planejamento e Tributação'
</script>

<h1>Início</h1>
<h2>Adição e gerenciamento</h2>
{#if pronto}
  <div class="row">
    <div class="column">
      <a class="button" href={$url('./produto')}>Adicionar produto</a>
    </div>
    <div class="column">
      <a class="button" href={$url('./produtos')}>Gerenciar produtos</a>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <a class="button" href={$url('./imposto')}>Adicionar imposto</a>
    </div>
    <div class="column">
      <a class="button" href={$url('./impostos')}>Gerenciar impostos</a>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <a class="button" href={$url('./transporta')}>Adicionar transportador</a>
    </div>
    <div class="column">
      <a class="button" href={$url('./transportes')}>
        Gerenciar transportadores
      </a>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <a class="button" href={$url('./veiculo')}>Adicionar veículo</a>
    </div>
    <div class="column">
      <a class="button" href={$url('./veiculos')}>Gerenciar veículos</a>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <a class="button" href={$url('./cliente')}>Adicionar cliente</a>
    </div>
    <div class="column">
      <a class="button" href={$url('./clientes')}>Gerenciar clientes</a>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <a class="button" href={$url('./nfe')}>Adicionar nota</a>
      <a class="button" href={$url('./importacao')}>Importar notas</a>
    </div>
    <div class="column">
      <a class="button" href={$url('./nfes')}>Gerenciar notas</a>
    </div>
  </div>
{/if}

{#if liberacao === NiveisAcesso.A}
  <h2>Área do administrador</h2>
  <div class="row">
    <div class="column">
      <a class="button" href={$url('./emitente')}>Atualizar dados empresa</a>
      <a class="button" href={$url('./configuracoes')}>Configurar emissão</a>
    </div>
    <div class="column">
      <a class="button" href={$url('./impressao')}>Configurar impressão</a>
      <a class="button" href={$url('./acesso')}>Controlar acesso</a>
    </div>
  </div>
{/if}

{#if !pronto}
  <Ajuda>
    {#if !$empresa.emit.enderEmit}
      <p>
        Cadastre as informações do emitente para ter acesso às funcionalidades
        do app, comece clicando no botão 'Atualizar emitente'.
      </p>
    {/if}
    {#if !$empresa.tokenIBPT}
      <p>
        Cadastre o seu token do <abbr title={titleIBPT}>IBPT</abbr>
        para ter acesso às funcionalidades do app, ele é um dos últimos controles
        da seção 'Configurações'. Caso ainda não tenha um token, acesse o site
        <a href="https://deolhonoimposto.ibpt.org.br/">De Olho No Imposto</a>
        , cadastre-se ou entre em sua conta, copie seu token e o insira no campo
        apropriado aqui no app. Este passo é importante para que as informações de
        tributação aproximada possam ser inseridas nas notas emitidas para consumidor
        final.
      </p>
    {/if}
  </Ajuda>
{/if}
