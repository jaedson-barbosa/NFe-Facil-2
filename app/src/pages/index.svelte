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
{#if pronto}
  <div class="row">
    <div class="column">
      <h3>Produtos</h3>
      <a class="button" href={$url('./produto')}>Adicionar</a>
      <a class="button" href={$url('./produtos')}>Gerenciar</a>
    </div>
    <div class="column">
      <h3>Perfis de tributação</h3>
      <a class="button" href={$url('./imposto')}>Adicionar</a>
      <a class="button" href={$url('./impostos')}>Gerenciar</a>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <h3>Transportadores</h3>
      <a class="button" href={$url('./transporta')}>Adicionar</a>
      <a class="button" href={$url('./transportes')}>Gerenciar</a>
    </div>
    <div class="column">
      <h3>Veículos</h3>
      <a class="button" href={$url('./veiculo')}>Adicionar</a>
      <a class="button" href={$url('./veiculos')}>Gerenciar</a>
    </div>
  </div>
  <div class="row">
    <div class="column">
      <h3>NF-es e NFC-es</h3>
      <a class="button" href={$url('./nfe')}>Adicionar</a>
      <a class="button" href={$url('./importacao')}>Importar</a>
      <a class="button" href={$url('./nfes')}>Gerenciar</a>
    </div>
    <div class="column">
      <h3>Clientes</h3>
      <a class="button" href={$url('./cliente')}>Adicionar</a>
      <a class="button" href={$url('./clientes')}>Gerenciar</a>
    </div>
  </div>
{/if}
{#if liberacao === NiveisAcesso.A}
  <h3>Área do administrador</h3>
  <div class="row">
    <div class="column">
      <a class="button" href={$url('./emitente')}>Atualizar emitente</a>
      <a class="button" href={$url('./configuracoes')}>
        Definições do emitente
      </a>
    </div>
    <div class="column">
      <a class="button" href={$url('./impressao')}>Definições de impressão</a>
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
