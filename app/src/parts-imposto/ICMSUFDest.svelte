<script lang="ts">
  export let raiz: any

  raiz.pICMSInterPart = '100.00'
  raiz.vICMSUFRemet = '0.00'
</script>

<h3>ICMS Interestadual</h3>
<p>
  Deve ser preenchido apenas nas vendas interestaduais para consumidor final não
  contribuinte do ICMS.
</p>
<label>
  Base de Cálculo do ICMS na UF do destinatário
  <input type="number" step="0.01" bind:value={raiz.vBCUFDest} required />
</label>
<label>
  Base de Cálculo do FCP na UF do destinatário
  <input type="number" step="0.01" bind:value={raiz.vBCFCPUFDest} required />
</label>
<label>
  Alíquota do FCP na UF do destinatário
  <input type="number" step="0.0001" bind:value={raiz.pFCPUFDest} />
</label>
<label>
  Alíquota interna na UF do destinatário
  <input type="number" step="0.0001" bind:value={raiz.pICMSUFDest} required />
</label>
<label>
  Alíquota interestadual das UF envolvidas
  <select bind:value={raiz.pICMSInter} required>
    <option value="4.00">4%: produtos importados</option>
    <option value="7.00">
      7%: Sul e Sudeste (exceto ES) para Norte e Nordeste ou ES
    </option>
    <option value="12.00">12%: demais casos</option>
  </select>
</label>
<label>
  Valor do ICMS relativo ao FCP da UF de destino
  <input type="number" step="0.01" bind:value={raiz.vFCPUFDest} />
</label>
<label>
  Valor do ICMS de partilha para a UF do destinatário
  <input type="number" step="0.01" bind:value={raiz.vICMSUFDest} required />
</label>
