<script lang="ts">
  import { refEmpresa } from '../code/store'
  import {
    processarNotas,
    processarClientes,
    processarTransportes,
    processarProdutos,
  } from '../code/importacao'
  import { url } from '@roxi/routify'

  let arquivos: FileList

  $: importar(arquivos)

  let logs: string[] = []
  const log = (texto: string) => (logs = [texto, ...logs])

  let finalizar: boolean = false

  async function importar(arquivos: FileList) {
    if (!arquivos?.length) return
    const ref = $refEmpresa
    const novasNotas = await processarNotas(ref, arquivos, log)
    if (novasNotas.length) {
      await processarClientes(ref, novasNotas, log)
      await processarTransportes(ref, novasNotas, log)
      await processarProdutos(ref, novasNotas, log)
    } else alert('Nenhuma mudança.')
    finalizar = true
  }
</script>

<h2>Importação de notas fiscais</h2>

{#if !arquivos.length}
  <label class="button" for="selecionar">
    Selecionar XMLs...
    <input
      id="selecionar"
      type="file"
      bind:files={arquivos}
      accept="application/xml"
      required
    />
  </label>
{:else}
  {#if finalizar}
    <a class="button" href={$url('./index')}>Continuar</a>
    <br />
  {/if}
  <p>
    Analisando arquivos e salvando novas notas, não saia nem feche esta janela.
  </p>
  <br />
  {#each logs as log (log)}
    <p>{log}</p>
  {/each}
{/if}
