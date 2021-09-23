<script lang="ts">
  export let raiz: any
  if (!raiz.II) raiz.II = {}

  const campos = ['vBC', 'vDespAdu', 'vII', 'vIOF']
  $: required = campos.some((v) => raiz.II[v])
</script>

<h3 class:opt={!required}>Imposto de Importação</h3>
<label>
  Base de cálculo
  <input
    type="number"
    step="0.01"
    min="0"
    bind:value={raiz.II.vBC}
    {required}
  />
</label>
<label>
  Valor das despesas aduaneiras
  <input
    type="number"
    step="0.01"
    min="0"
    bind:value={raiz.II.vDespAdu}
    {required}
  />
</label>
<label>
  Valor do II
  <input
    type="number"
    step="0.01"
    min="0"
    bind:value={raiz.II.vII}
    {required}
  />
</label>
<label>
  Valor do IOF
  <input
    type="number"
    step="0.01"
    min="0"
    bind:value={raiz.II.vIOF}
    {required}
  />
</label>
<br />
