<script lang="ts">
  export let encerrante: any

  let informar = !!encerrante
  $: encerrante = informar ? {} : undefined
</script>

<label>
  Adicionar informações do encerrante
  <select bind:value={informar}>
    <option value={false}>Não</option>
    <option value={true}>Sim</option>
  </select>
</label>
<label>
  Numero do bico utilizado no abastecimento
  <input type="number" step="1" bind:value={encerrante.nBico} required />
</label>
<label>
  Numero de identificação do tanque
  <input type="number" step="1" bind:value={encerrante.nTanque} required />
</label>
<label>
  Valor do encerrante no ínicio do abastecimento
  <input type="number" step="0.001" bind:value={encerrante.vEncIni} required />
</label>
<label>
  Valor do Encerrante no final do abastecimento
  <input type="number" step="0.001" bind:value={encerrante.vEncFin} required />
</label>
<label>
  <i>Numero da bomba</i>
  <input type="number" bind:value={encerrante.nBomba} />
</label>
