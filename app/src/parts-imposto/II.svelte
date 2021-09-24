<script lang="ts">
  export let II: any

  let informar = !!II
  $: II = informar ? {} : undefined
</script>

<label>
  <input type="checkbox" bind:checked={informar} />
  Produto com incidência de imposto de importação
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
