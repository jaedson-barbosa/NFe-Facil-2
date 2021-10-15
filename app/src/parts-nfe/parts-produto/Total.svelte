<script lang="ts">
  import { calcularICMSTot } from '../../code/nfe/total'
  import { getMoeda } from '../../code/numero'

  export let det: any
  export let total: any
  export let consumidorFinal: boolean

  if (!total) total = {}
  if (!total.retTrib) total.retTrib = {}

  $: total.ICMSTot = calcularICMSTot(det, consumidorFinal)
  $: ICMSTot = total.ICMSTot
</script>

<h2>Totais</h2>
<table>
  <thead>
    <tr>
      <th>Descrição</th>
      <th>Valor</th>
    </tr>
  </thead>
  <tbody>
    {#if ICMSTot.vProd}
      <tr>
        <td>Valor total dos produtos e serviços</td>
        <td>{getMoeda(ICMSTot.vProd)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vFrete}
      <tr>
        <td>Valor total do frete</td>
        <td>{getMoeda(ICMSTot.vFrete)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vSeg}
      <tr>
        <td>Valor total do seguro</td>
        <td>{getMoeda(ICMSTot.vSeg)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vDesc}
      <tr>
        <td>Valor total do desconto</td>
        <td>{getMoeda(ICMSTot.vDesc)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vOutro}
      <tr>
        <td>Outras Despesas acessórias</td>
        <td>{getMoeda(ICMSTot.vOutro)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vBC}
      <tr>
        <td>Base de cálculo do ICMS</td>
        <td>{getMoeda(ICMSTot.vBC)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vICMS}
      <tr>
        <td>Valor total do ICMS</td>
        <td>{getMoeda(ICMSTot.vICMS)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vICMSDeson}
      <tr>
        <td>Valor total do ICMS desonerado</td>
        <td>{getMoeda(ICMSTot.vICMSDeson)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vFCPUFDest}
      <tr>
        <td>Valor total do ICMS relativo ao FCP da UF de destino</td>
        <td>{getMoeda(ICMSTot.vFCPUFDest)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vICMSUFDest}
      <tr>
        <td>Valor total do ICMS Interestadual para a UF de destino</td>
        <td>{getMoeda(ICMSTot.vICMSUFDest)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vICMSUFRemet}
      <tr>
        <td>Valor total do ICMS Interestadual para a UF do remetente</td>
        <td>{getMoeda(ICMSTot.vICMSUFRemet)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vFCP}
      <tr>
        <td>Valor total do FCP</td>
        <td>{getMoeda(ICMSTot.vFCP)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vBCST}
      <tr>
        <td>Base de Cálculo do ICMS ST</td>
        <td>{getMoeda(ICMSTot.vBCST)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vST}
      <tr>
        <td>Valor total do ICMS ST</td>
        <td>{getMoeda(ICMSTot.vST)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vFCPST}
      <tr>
        <td>Valor total do FCP retido por ST</td>
        <td>{getMoeda(ICMSTot.vFCPST)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vFCPSTRet}
      <tr>
        <td>Valor total do FCP retido anteriormente por ST</td>
        <td>{getMoeda(ICMSTot.vFCPSTRet)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vII}
      <tr>
        <td>Valor total do II</td>
        <td>{getMoeda(ICMSTot.vII)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vIPI}
      <tr>
        <td>Valor total do IPI</td>
        <td>{getMoeda(ICMSTot.vIPI)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vIPIDevol}
      <tr>
        <td>Valor total do IPI devolvido</td>
        <td>{getMoeda(ICMSTot.vIPIDevol)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vPIS}
      <tr>
        <td>Valor do PIS</td>
        <td>{getMoeda(ICMSTot.vPIS)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vCOFINS}
      <tr>
        <td>Valor da COFIN</td>
        <td>{getMoeda(ICMSTot.vCOFINS)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vNF}
      <tr>
        <td>Valor total da NF-e</td>
        <td>{getMoeda(ICMSTot.vNF)}</td>
      </tr>
    {/if}
    {#if ICMSTot.vTotTrib}
      <tr>
        <td>Valor aproximado total de tributos</td>
        <td>{getMoeda(ICMSTot.vTotTrib)}</td>
      </tr>
    {/if}
  </tbody>
</table>

<h3>Retenção de tributos</h3>
<div class="row">
  <div class="column">
    <label>
      <i>Valor Retido de PIS</i>
      <input type="number" step="0.01" bind:value={total.retTrib['vRetPIS']} />
    </label>
    <label>
      <i>Valor Retido de COFINS</i>
      <input type="number" step="0.01" bind:value={total.retTrib['vRetCOFINS']} />
    </label>
    <label>
      <i>Valor Retido de CSLL</i>
      <input type="number" step="0.01" bind:value={total.retTrib['vRetCSLL']} />
    </label>
    <label>
      <i>Base de Cálculo do IRRF</i>
      <input type="number" step="0.01" bind:value={total.retTrib['vBCIRRF']} />
    </label>
  </div>
  <div class="column">
    <label>
      <i>Valor Retido de IRRF</i>
      <input type="number" step="0.01" bind:value={total.retTrib['vIRRF']} />
    </label>
    <label>
      <i>Base de Cálculo da Retenção da Previdêncica Social</i>
      <input type="number" step="0.01" bind:value={total.retTrib['vBCRetPrev']} />
    </label>
    <label>
      <i>Valor da Retenção da Previdêncica Social</i>
      <input type="number" step="0.01" bind:value={total.retTrib['vRetPrev']} />
    </label>
  </div>
</div>
