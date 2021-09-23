<script lang="ts">
  export let raiz: any
  if (!raiz.detExport) raiz.detExport = []

  function analisarDireto(index: number) {
    return () => {
      if (raiz.detExport[index].nDraw > 0) return
      remover(index)
    }
  }

  function analisarIndireto(index: number) {
    return () => {
      const v = raiz.detExport[index].exportInd
      if (v.nRE || v.chNFe || v.qExport) return
      remover(index)
    }
  }

  function remover(index: number) {
    raiz.detExport.splice(index, 1)
    raiz.detExport = raiz.detExport
  }
</script>

<h3>Detalhe da exportação</h3>
<button
  type="button"
  on:click={() => (raiz.detExport = [{}, ...raiz.detExport])}
>
  Adicionar direta
</button>
<button
  type="button"
  on:click={() => (raiz.detExport = [{ exportInd: {} }, ...raiz.detExport])}
>
  Adicionar indireta
</button>
<br />
{#if raiz.detExport.length}
  <table>
    <thead>
      <tr>
        <th><i>Nº ato concessório</i></th>
        <th>Nº registro de exportação</th>
        <th>Chave NF-e para exportação</th>
        <th>Quant. realmente exportada</th>
      </tr>
    </thead>
    <tbody>
      {#each raiz.detExport as _, i}
        <tr>
          {#if raiz.detExport[i].exportInd}
            <td>
              <input
                bind:value={raiz.detExport[i].nDraw}
                pattern={'[0-9]{0,11}'}
              />
            </td>
            <td>
              <input
                bind:value={raiz.detExport[i].exportInd.nRE}
                on:blur={analisarIndireto(i)}
                pattern={'[0-9]{0,12}'}
                required
              />
            </td>
            <td>
              <input
                bind:value={raiz.detExport[i].exportInd.chNFe}
                on:blur={analisarIndireto(i)}
                pattern={'[0-9]{44}'}
                required
              />
            </td>
            <td>
              <input
                type="number"
                step="0.0001"
                bind:value={raiz.detExport[i].exportInd.qExport}
                on:blur={analisarIndireto(i)}
                required
              />
            </td>
          {:else}
            <td>
              <input
                bind:value={raiz.detExport[i].nDraw}
                on:blur={analisarDireto(i)}
                pattern={'[0-9]{0,11}'}
                required
              />
            </td>
            <td colspan="3">Não informado</td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<br />
