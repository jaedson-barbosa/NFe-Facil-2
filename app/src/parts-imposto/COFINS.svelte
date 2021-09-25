<script lang="ts">
  import { calcular, CST } from '../code/imposto/PISCOFINS'
  import { getMoeda } from '../code/numero'

  export let raiz: any
  export let prod: any

  if (!raiz['COFINS']) raiz['COFINS'] = { CST: '01' }
  let COFINS = Object.values(raiz['COFINS'])[0]
  let tipoCOFINS = COFINS['CST']
  $: {
    let c = ['01', '02'].includes(tipoCOFINS)
      ? 'COFINSAliq'
      : tipoCOFINS == '03'
      ? 'COFINSQtde'
      : ['04', '05', '06', '07', '08', '09'].includes(tipoCOFINS)
      ? 'COFINSNT'
      : 'COFINSOutr'
    raiz['COFINS'] = {}
    COFINS = raiz['COFINS'][c] = { CST: tipoCOFINS }
  }

  $: comAliquota = !['04', '05', '06', '07', '08', '09'].includes(tipoCOFINS)
  $: aliquotaEmPercentual = tipoCOFINS != '03' && !COFINS['vAliqProd']
  $: aliquotaEmReais =
    tipoCOFINS != '01' && tipoCOFINS != '02' && !COFINS['pCOFINS']
  $: COFINS = calcular(prod, COFINS, 'COFINS')
</script>

<h3>COFINS</h3>
<label>
  CST
  <select bind:value={tipoCOFINS} required>
    {#each CST as e}
      <option value={e[0]}>{e[0]} - {e[1]}</option>
    {/each}
  </select>
</label>
{#if comAliquota}
  {#if aliquotaEmPercentual}
    <label>
      Alíquota em percentual
      <input type="number" step="0.0001" bind:value={COFINS['pCOFINS']} required />
    </label>
  {/if}
  {#if aliquotaEmReais}
    <label>
      Alíquota em reais
      <input type="number" step="0.0001" bind:value={COFINS['vAliqProd']} required />
    </label>
  {/if}
  {#if COFINS['vCOFINS']}
    <p>
      <strong>COFINS calculado:</strong>
      {getMoeda(COFINS['vCOFINS'])}
    </p>
  {/if}
{/if}
