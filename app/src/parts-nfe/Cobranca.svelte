<script lang="ts">
import { getInteiroStr } from '../code/numero';

  import { pattern } from '../code/patterns'
  import Adicionar from '../components/Adicionar.svelte'

  export let cobr: any

  if (!cobr.fat) cobr.fat = {}
  let dup: any[] = cobr.dup ?? (cobr.dup = [])
  $: {
    dup.forEach((v, i) => (v.nDup = getInteiroStr(i + 1, 3)))
    cobr.dup = dup
  }

  function validarValorParcela(index: number) {
    return () => {
      if (!dup[index].vDup) {
        dup.splice(index, 1)
        dup = dup
      }
    }
  }
</script>

<h2>Cobrança</h2>
<div class="row">
  <div class="column">
    <label>
      Número da fatura
      <input bind:value={cobr.fat.nFat} maxlength="60" {pattern} required />
    </label>
    <label>
      Desconto
      <input type="number" step="0.01" bind:value={cobr.fat.vDesc} required />
    </label>
  </div>
  <div class="column">
    <label>
      Valor original da fatura
      <input type="number" step="0.01" bind:value={cobr.fat.vOrig} required />
    </label>
    <label>
      Valor líquido da fatura
      <input type="number" step="0.01" bind:value={cobr.fat.vLiq} required />
    </label>
  </div>
</div>
<h3>Parcelas <Adicionar on:click={() => (dup = [...dup, {}])} /></h3>
{#if dup.length}
  <table>
    <thead>
      <tr>
        <th>Número</th>
        <th>Valor</th>
        <th>Cencimento</th>
      </tr>
    </thead>
    <tbody>
      {#each dup as v, i}
        <tr>
          <td>v.nDup</td>
          <td>
            <input
              type="number"
              step="0.01"
              bind:value={v.vDup}
              on:blur={validarValorParcela(i)}
              required
            />
          </td>
          <td>
            <input type="date" bind:value={v.dVenc} required />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<br />
