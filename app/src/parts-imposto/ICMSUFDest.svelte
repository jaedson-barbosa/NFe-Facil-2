<script lang="ts">
  import { getMoeda } from '../code/numero'

  export let raiz: any

  raiz.pICMSInterPart = '100.00'
  raiz.vICMSUFRemet = '0.00'
</script>

<h3>ICMS da UF do destinatário</h3>
{#if raiz.vBCUFDest}
  <p>
    <strong>Base de cálculo</strong>
    <small>vProd + vFrete + vSeg + vOutro - vDesc + vIPI</small>
    {getMoeda(raiz.vBCUFDest)}
  </p>
{/if}
<label>
  Alíquota do ICMS
  <input type="number" step="0.0001" bind:value={raiz.pICMSUFDest} required />
</label>
<label>
  Alíquota do FCP
  <input
    type="number"
    step="0.0001"
    min="0"
    max="2"
    bind:value={raiz.pFCPUFDest}
  />
</label>
{#if raiz.pICMSInter}
  <p>
    <strong>Alíquota interestadual das UF envolvidas</strong>
    {raiz.pICMSInter}%
  </p>
{/if}
{#if raiz.vFCPUFDest}
  <p>
    <strong>Valor do FCP</strong>
    {getMoeda(raiz.vFCPUFDest)}
  </p>
{/if}
{#if raiz.vICMSUFDest}
  <p>
    <strong>Valor do ICMS</strong>
    <small>vBC * (pICMSUFDest - pICMSInter) / 100</small>
    {getMoeda(raiz.vICMSUFDest)}
  </p>
{/if}
