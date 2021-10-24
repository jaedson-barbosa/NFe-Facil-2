<script lang="ts">
  import { url } from '@roxi/routify'
  import { edicao, liberacoes, idEmpresa, empresa } from '../code/store'
  import { NiveisAcesso } from '../code/tipos'

  $edicao = undefined
</script>

<h1>Início</h1>
{#if $liberacoes?.find((v) => v.cnpj == idEmpresa)?.nivel === NiveisAcesso.A}
  <h3>Área do administrador</h3>
  <a class="button" href={$url('./emitente')}>Atualizar emitente</a>
  <a class="button" href={$url('./configuracoes')}>Definições do emitente</a>
  <a class="button" href={$url('./impressao')}>Definições de impressão</a>
  <a class="button" href={$url('./acesso')}>Controlar acesso</a>
  <p>
    Mantenha todos os dados do emitente atualizados e personalize tudo de acordo
    com as suas necessidades e preferências.
  </p>
{/if}

{#if $empresa.emit.enderEmit && $empresa.tokenIBPT}
  <h3>NF-es e NFC-es</h3>
  <a class="button" href={$url('./nfe')}>Adicionar</a>
  <a class="button" href={$url('./importacao')}>Importar</a>
  <a class="button" href={$url('./nfes')}>Gerenciar</a>
  <p>
    Emita notas fiscais em produção, aprenda emitindo em homologação, passe
    orçamentos com notas sem valor fiscal e importe notas fiscais emitidas em
    qualquer emissor.
  </p>

  <h3>Clientes</h3>
  <a class="button" href={$url('./cliente')}>Adicionar</a>
  <a class="button" href={$url('./clientes')}>Gerenciar</a>

  <h3>Produtos</h3>
  <a class="button" href={$url('./produto')}>Adicionar</a>
  <a class="button" href={$url('./produtos')}>Gerenciar</a>

  <h3>Perfis de tributação</h3>
  <a class="button" href={$url('./imposto')}>Adicionar</a>
  <a class="button" href={$url('./impostos')}>Gerenciar</a>

  <h3>Transportadores</h3>
  <a class="button" href={$url('./transporta')}>Adicionar</a>
  <a class="button" href={$url('./transportes')}>Gerenciar</a>

  <h3>Veículos</h3>
  <a class="button" href={$url('./veiculo')}>Adicionar</a>
  <a class="button" href={$url('./veiculos')}>Gerenciar</a>
{:else if !$empresa.emit.enderEmit}
  <p>
    Cadastre as informações do emitente para ter acesso às funcionalidades do
    app, comece clicando no botão 'Atualizar emitente'.
  </p>
{:else}
  <p>
    Cadastre o seu token do <abbr
      title="Instituto Brasileiro de Planejamento e Tributação"
    >
      IBPT
    </abbr>
    para ter acesso às funcionalidades do app, ele é um dos últimos controles da
    seção 'Configurações'. Caso ainda não tenha um token, acesse o site
    <a href="https://deolhonoimposto.ibpt.org.br/">De Olho No Imposto</a>
    , cadastre-se ou entre em sua conta, copie seu token e o insira no campo apropriado
    aqui no app. Este passo é importante para que as informações de tributação aproximada
    possam ser inseridas nas notas emitidas para consumidor final.
  </p>
{/if}
