<script lang="ts">
  import { CSOSN, CST, origem, calcular } from '../code/imposto/ICMS'
  import FCPSTRet from './parts-ICMS/FCPSTRet.svelte'
  import Proprio from './parts-ICMS/Proprio.svelte'
  import ProprioDif from './parts-ICMS/ProprioDif.svelte'
  import STRet from './parts-ICMS/STRet.svelte'
  import Efet from './parts-ICMS/Efet.svelte'
  import FCP from './parts-ICMS/FCP.svelte'
  import FCPST from './parts-ICMS/FCPST.svelte'
  import ST from './parts-ICMS/ST.svelte'
  import STPart from './parts-ICMS/STPart.svelte'
  import STDest from './parts-ICMS/STDest.svelte'
  import Cred from './parts-ICMS/Cred.svelte'
  import Desonerado from './parts-ICMS/Desonerado.svelte'

  export let raiz: any
  export let regimeNormal: boolean
  export let prod: any
  export let ipi: any
  export let consumidorFinal: boolean

  const CS = regimeNormal ? CST : CSOSN

  if (!raiz['ICMS']) raiz['ICMS'] = {}
  let ICMS: any =
    Object.values(raiz['ICMS'])[0] ??
    (regimeNormal
      ? (raiz['ICMS']['ICMS00'] = { CST: '00' })
      : (raiz['ICMS']['ICMSSN101'] = { CSOSN: '101' }))

  let tipoICMS = ICMS[regimeNormal ? 'CST' : 'CSOSN']
  if (regimeNormal && raiz['ICMSPart']) tipoICMS = 'Part' + tipoICMS
  if (regimeNormal && raiz['ICMSST']) tipoICMS = 'ST' + tipoICMS

  $: {
    raiz['ICMS'] = {}
    let t = tipoICMS as string
    let c: string
    if (t === '41' || t === '50') {
      c = 'ICMS40'
    } else if (t === 'Part10' || t === 'Part90') {
      c = 'ICMSPart'
      t = t === 'Part10' ? '10' : '90'
    } else if (t === 'ST41' || t === 'ST60') {
      c = 'ICMSST'
      t = t === 'ST41' ? '41' : '60'
    } else if (regimeNormal) {
      c = 'ICMS' + t
    } else if (['102', '103', '300', '400'].includes(t)) {
      c = 'ICMSSN102'
    } else {
      c = 'ICMSSN' + t
    }
    ICMS = raiz['ICMS'][c] = regimeNormal ? { CST: t } : { CSOSN: t }
  }

  $: ICMS = calcular(prod, ICMS, ipi, consumidorFinal)
</script>

<h3>ICMS</h3>
<label>
  Código de situação
  <select bind:value={tipoICMS} required>
    {#each CS as e}
      <option value={e[0]}>{e[0]} - {e[1]}</option>
    {/each}
  </select>
</label>
<label>
  Origem da mercadoria
  <select bind:value={ICMS['orig']} required>
    {#each origem as e}
      <option value={e[0]}>{e[0]} - {e[1]}</option>
    {/each}
  </select>
</label>
{#if ['00', '10', '20', '51', '70', '90', 'Part10', 'Part90', '900'].includes(tipoICMS)}
  {#if tipoICMS == '51'}
    <ProprioDif bind:ICMS {consumidorFinal} />
  {:else}
    <Proprio
      bind:ICMS
      {consumidorFinal}
      incluirRedBC={!['00', '10'].includes(tipoICMS)}
      obrigatorioRedBC={['20', '70', '90'].includes(tipoICMS)}
    />
  {/if}
  {#if !['Part10', 'Part90', '900'].includes(tipoICMS)}
    <FCP bind:ICMS />
  {/if}
{/if}
{#if ['10', '30', '70', '90', 'Part10', 'Part90', '201', '202', '203', '900'].includes(tipoICMS)}
  <ST bind:ICMS />
  {#if ['Part10', 'Part90'].includes(tipoICMS)}
    <STPart bind:ICMS />
  {/if}
  {#if !['Part10', 'Part90'].includes(tipoICMS)}
    <FCPST bind:ICMS />
  {/if}
{/if}
{#if ['60', 'ST41', 'ST60', '500'].includes(tipoICMS)}
  <STRet bind:ICMS pSTRequired={!['ST41', 'ST60'].includes(tipoICMS)} />
  <FCPSTRet bind:ICMS />
  {#if ['ST41', 'ST60'].includes(tipoICMS)}
    <STDest bind:ICMS />
  {/if}
  <Efet bind:ICMS />
{/if}
{#if ['20', '30', '40', '41', '50', '70', '90'].includes(tipoICMS)}
  <Desonerado bind:ICMS {tipoICMS} />
{/if}
{#if ['101', '201', '900'].includes(tipoICMS)}
  <Cred bind:ICMS opcional={tipoICMS == '900'} />
{/if}
