<script lang="ts">
  import { refEmpresa } from '../code/store'
  import { processarArquivos } from '../code/importacao'
  import { url } from '@roxi/routify'
  import Voltar from '../components/Voltar.svelte'

  let arquivos: FileList

  $: importar(arquivos)

  let logs: string[] = []
  let finalizar: boolean = false

  async function importar(arquivos: FileList) {
    if (!arquivos?.length) return
    const ref = $refEmpresa
    await processarArquivos(ref, arquivos, (v) => (logs = [v, ...logs]))
    finalizar = true
  }
</script>

<h1>
  {#if !arquivos?.length} <Voltar /> {/if}
  Importação
</h1>
<p>
  XMLs de notas fiscais já emitidas e de eventos de cancelamento podem ser
  importados para que sejam guardados na segurança da Google Cloud e, a partir
  de seus dados, sejam preenchidas corretamente as tabelas de notas fiscais,
  clientes, produtos (apenas aqueles com codificação própria, ou seja, aqueles
  cujo código iniciar com 'CFOP' serão desconsiderados) e seus tributos (apenas
  um perfil tributário para cada par de produto/CFOP), transportadores e
  veículos.
</p>

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
  {#if finalizar}
    <a class="button" href={$url('./index')}>Continuar</a>
  {:else}
    <p>
      Analisando arquivos e salvando...
      <br />
      Não saia nem feche esta janela!
    </p>
  {/if}
  <hr />
  {#each logs as log (log)}
    <p>{log}</p>
  {/each}
{/if}
