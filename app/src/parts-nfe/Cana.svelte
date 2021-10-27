<script lang="ts">
  import Adicionar from '../components/Adicionar.svelte'

  export let cana: any
  let forDia: any[] = cana.forDia ?? (cana.forDia = [])
  $: cana.forDia = forDia

  let deduc: any[] = cana.deduc ?? (cana.deduc = [])
  $: cana.deduc = deduc

  function validarForDia(i: number) {
    return () => {
      if (!forDia[i].dia) {
        forDia.splice(i, 1)
        forDia = forDia
      }
    }
  }

  function validarDeduc(i: number) {
    return () => {
      if (!deduc[i].xDed) {
        deduc.splice(i, 1)
        deduc = deduc
      }
    }
  }
</script>

<h2>Aquisição de cana</h2>
<div class="row">
  <div class="column">
    <label>
      Safra
      <input
        bind:value={cana.safra}
        title="Formato: AAAA ou AAAA/AAAA"
        pattern="(\d{4})|(\d{4}\/\d{4})"
        required
      />
    </label>
  </div>
  <div class="column">
    <label>
      Mês e ano de referência
      <input
        bind:value={cana.ref}
        title="Formato: MM/AAAA"
        pattern="(0[1-9]|1[0-2])([/][2][0-9][0-9][0-9])"
        required
      />
    </label>
  </div>
</div>
<h3>
  Fornecimento diário
  <Adicionar on:click={() => (forDia = [...forDia, {}])} />
</h3>
{#if forDia.length}
  <table>
    <thead>
      <tr>
        <th>Dia</th>
        <th>Quantidade</th>
      </tr>
    </thead>
    <tbody>
      {#each forDia as v, i}
        <tr>
          <td>
            <input
              type="number"
              step="1"
              min="1"
              max="31"
              bind:value={v.dia}
              on:blur={validarForDia(i)}
              required
            />
          </td>
          <td>
            <input
              type="number"
              min="0"
              step="0.0001"
              bind:value={v.qtde}
              required
            />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<div class="row">
  <div class="column">
    <label>
      Quantidade total do mês
      <input type="number" step="0.0001" bind:value={cana.qTotMes} required />
    </label>
  </div>
  <div class="column">
    <label>
      Quantidade total anterior
      <input type="number" step="0.0001" bind:value={cana.qTotAnt} required />
    </label>
  </div>
  <div class="column">
    <label>
      Quantidade total geral
      <input type="number" step="0.0001" bind:value={cana.qTotGer} required />
    </label>
  </div>
</div>
<h3>Deduções <Adicionar on:click={() => (deduc = [...deduc, {}])} /></h3>
{#if deduc.length}
  <table>
    <thead>
      <tr>
        <th>Descrição</th>
        <th>Valor</th>
      </tr>
    </thead>
    <tbody>
      {#each deduc as v, i}
        <tr>
          <td>
            <input
              maxlength="60"
              bind:value={v.xDed}
              on:blur={validarDeduc(i)}
              required
            />
          </td>
          <td>
            <input type="number" step="0.01" bind:value={v.vDed} required />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<div class="row">
  <div class="column">
    <label>
      Valor total dos fornecimentos
      <input type="number" step="0.01" bind:value={cana.vFor} required />
    </label>
  </div>
  <div class="column">
    <label>
      Valor total das deduções
      <input type="number" step="0.01" bind:value={cana.vTotDed} required />
    </label>
  </div>
  <div class="column">
    <label>
      Valor líquido dos fornecimentos
      <input type="number" step="0.01" bind:value={cana.vLiqFor} required />
    </label>
  </div>
</div>
