<script lang="ts">
  import { pattern } from '../code/patterns'

  export let compra: any
</script>

<h2>Venda/Compra pública</h2>
<div class="row">
  <div class="column">
    <label>
      <i>Nota de empenho</i>
      <input bind:value={compra.xNEmp} maxlength="22" {pattern} />
    </label>
  </div>
  <div class="column">
    <label>
      <i>Pedido</i>
      <input bind:value={compra.xPed} maxlength="60" {pattern} />
    </label>
  </div>
</div>
<label>
  <i>Contrato</i>
  <input bind:value={compra.xCont} maxlength="60" {pattern} />
</label>
<br />