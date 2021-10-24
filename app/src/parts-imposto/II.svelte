<script lang="ts">
  export let II: any

  let informar = !!II
  $: {
    if (informar && !II) II = {}
    else if (!informar && II) II = undefined
  }
</script>

<label>
  Informar imposto de importação
  <select bind:value={informar}>
    <option value={true}>Sim</option>
    <option value={false}>Não</option>
  </select>
</label>
{#if II}
  <label>
    Base de cálculo
    <input
      type="number"
      step="0.01"
      min="0"
      bind:value={II.vBC}
      required
    />
  </label>
  <label>
    Valor das despesas aduaneiras
    <input
      type="number"
      step="0.01"
      min="0"
      bind:value={II.vDespAdu}
      required
    />
  </label>
  <label>
    Valor do II
    <input
      type="number"
      step="0.01"
      min="0"
      bind:value={II.vII}
      required
    />
  </label>
  <label>
    Valor do IOF
    <input
      type="number"
      step="0.01"
      min="0"
      bind:value={II.vIOF}
      required
    />
  </label>
  <br />
{/if}
