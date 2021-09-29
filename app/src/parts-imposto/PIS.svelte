<script lang="ts">
  import { CST } from '../code/imposto/PISCOFINS'
  import { getMoeda } from '../code/numero'

  export let raiz: any

  if (!raiz['PIS']) raiz['PIS'] = { CST: '01' }
  let PIS = Object.values(raiz['PIS'])[0]
  let tipoPIS = PIS['CST']
  $: {
    let c = ['01', '02'].includes(tipoPIS)
      ? 'PISAliq'
      : tipoPIS == '03'
      ? 'PISQtde'
      : ['04', '05', '06', '07', '08', '09'].includes(tipoPIS)
      ? 'PISNT'
      : 'PISOutr'
    raiz['PIS'] = {}
    PIS = raiz['PIS'][c] = { CST: tipoPIS }
  }

  $: comAliquota = !['04', '05', '06', '07', '08', '09'].includes(tipoPIS)
  $: aliquotaEmPercentual = tipoPIS != '03' && !PIS['vAliqProd']
  $: aliquotaEmReais = tipoPIS != '01' && tipoPIS != '02' && !PIS['pPIS']
</script>

<h3>PIS</h3>
<label>
  CST
  <select bind:value={tipoPIS} required>
    {#each CST as e}
      <option value={e[0]}>{e[0]} - {e[1]}</option>
    {/each}
  </select>
</label>
{#if comAliquota}
  {#if aliquotaEmPercentual}
    <label>
      Alíquota em percentual
      <input type="number" step="0.0001" bind:value={PIS['pPIS']} required />
    </label>
  {/if}
  {#if aliquotaEmReais}
    <label>
      Alíquota em reais
      <input type="number" step="0.0001" bind:value={PIS['vAliqProd']} required />
    </label>
  {/if}
  {#if PIS['vPIS']}
    <p>
      <strong>PIS calculado:</strong>
      {getMoeda(PIS['vPIS'])}
    </p>
  {/if}
{/if}
