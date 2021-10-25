<script lang="ts">
  import { carregando, refEmpresa } from '../code/store'
  import { processarArquivos } from '../code/importacao'
  import { url } from '@roxi/routify'
  import Voltar from '../components/Voltar.svelte'
  import Ajuda from '../components/Ajuda.svelte'

  let arquivos: FileList

  $: importar(arquivos)

  let logs: string[] = []

  async function importar(arquivos: FileList) {
    if (!arquivos?.length) return
    $carregando = true
    await processarArquivos(refEmpresa, arquivos, (v) => (logs = [v, ...logs]))
    $carregando = false
  }
</script>

<h1>
  {#if !arquivos?.length} <Voltar /> {/if}
  Importação
</h1>

{#if !arquivos?.length}
  <label class="button" for="selecionar">
    Selecionar XMLs...
    <input
      id="selecionar"
      type="file"
      bind:files={arquivos}
      accept="application/xml"
      multiple
      required
    />
  </label>
{:else}
  {#if !$carregando}
    <a class="button" href={$url('./index')}>Continuar</a>
  {/if}
  {#each logs as log (log)}<p>{log}</p>{/each}
{/if}
<Ajuda>
  <p>
    XMLs de notas fiscais já emitidas e de eventos de cancelamento podem ser
    importados para que sejam guardados na segurança da Google Cloud e, a partir
    de seus dados, sejam preenchidas corretamente as tabelas de notas fiscais,
    clientes, produtos (apenas aqueles com codificação própria) e seus tributos
    (apenas um perfil tributário para cada produto), transportadores e veículos.
  </p>
  <p>
    Junto com a adição dos produtos, também é feita uma consulta ao IBPT para
    preencher os dados de tributação aproximada, que são automaticamente
    preenchidos na criação do documento fiscal a fim de atender a Lei da
    Transparência (Lei Federal nº 12.741/12).
  </p>
  <p>
    Por fim, em relação aos perfis tributários, nem todos os campos são
    automatizados devido à extrema complexidade de cálculo (muitos impostos
    podem ser calculados de milhões de formas diferentes), falta de informação
    disponível (nem sempre achar as fórmulas de cálculo é fácil) ou simplesmente
    por não poderem ser automatizados (dependem de valores externos ao emissor),
    são eles: imposto de importação, ICMS Interestadual para consumidor final
    não contribuinte do ICMS e campos do ICMS: ST retido anteriormente, FCP do
    ST retido anteriomente, ST da UF de destino, efetivo, desonerado e crédito.
    Por sorte, a imensa maioria das empresas não preenchem estes campos, que
    geralmente são usados apenas em situações específicas por poucas empresas ou
    em raras ocasiões, então podes ficar tranquilo pois é quase certo que teus
    impostos possam ser calculados automaticamente pela aplicação desde que tudo
    esteja parametrizado corretamente. Também cabe ressaltar que, mesmo que
    alguns perfis tributários sejam modificados ou não sejam importados, o
    cadastro manual não tem quaisquer limitação e podes inserir os tributos
    conforme a necessidade de tua empresa. Por fim, caso queiras mais detalhes,
    eles podem ser encontrados na tela de gerenciamento de tributação.
  </p>
</Ajuda>
