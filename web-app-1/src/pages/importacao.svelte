<script lang="ts">
  import { refEmpresa } from '../code/store'
  import { processarArquivos } from '../code/importacao'
  import { url } from '@roxi/routify'

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

<h2>Importação de notas fiscais</h2>

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
