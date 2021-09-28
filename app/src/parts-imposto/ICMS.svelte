<script lang="ts">
  import {
    CSOSN,
    CST,
    origem,
    getMotDes,
    modBCST,
    calcular,
  } from '../code/imposto/ICMS'
  import { getMoeda } from '../code/numero'
  import { EstadosEX } from '../code/IBGE'
  import FCPSTRet from './parts-ICMS/FCPSTRet.svelte'
  import Proprio from './parts-ICMS/Proprio.svelte';
  import STRet from './parts-ICMS/STRet.svelte'
  import Efet from './parts-ICMS/Efet.svelte'

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
  <Proprio bind:ICMS {consumidorFinal} {tipoICMS} />
  {#if !['Part10', 'Part90', '900'].includes(tipoICMS)}
    <h4>Fundo de Combate à Pobreza</h4>
    {#if ICMS['vBCFCP']}
      <p>
        <strong>Base de cálculo:</strong>
        {getMoeda(ICMS['vBCFCP'])}
      </p>
    {/if}
    <label>
      Percentual
      <input type="number" step="0.0001" bind:value={ICMS['pFCP']} />
    </label>
    {#if ICMS['vFCP']}
      <p>
        <strong>Valor:</strong>
        {getMoeda(ICMS['vFCP'])}
      </p>
    {/if}
    <br />
  {/if}
{/if}
{#if ['10', '30', '70', '90', 'Part10', 'Part90', '201', '202', '203', '900'].includes(tipoICMS)}
  <h4>ICMS - Substituição tributária</h4>
  <label>
    Modalidade de determinação da BC do ICMS ST
    <select bind:value={ICMS['modBCST']} required>
      {#each modBCST as e}
        <option value={e[0]}>{e[0]} - {e[1]}</option>
      {/each}
    </select>
  </label>
  <label>
    <i>Percentual MVA ST</i>
    <input type="number" step="0.0001" bind:value={ICMS['pMVAST']} />
  </label>
  <label>
    <i>Percentual de redução da BC ST</i>
    <input type="number" step="0.0001" bind:value={ICMS['pRedBCST']} />
  </label>
  {#if ICMS['vBCST']}
    <p>
      <strong>Base de cálculo do ST:</strong>
      {getMoeda(ICMS['vBCST'])}
    </p>
  {/if}
  <label>
    Alíquota do ST
    <input type="number" step="0.0001" bind:value={ICMS['pICMSST']} required />
  </label>
  {#if ICMS['vICMSST']}
    <p>
      <strong>Valor do ST:</strong>
      {getMoeda(ICMS['vICMSST'])}
    </p>
  {/if}
  {#if ['Part10', 'Part90'].includes(tipoICMS)}
    <label>
      Percentual da BC da operação própria
      <input type="number" step="0.0001" bind:value={ICMS['pBCOp']} required />
    </label>
    <label>
      UF para qual é devido o ICMS ST
      <select bind:value={ICMS.UFST} required>
        {#each EstadosEX as uf}
          <option value={uf.Sigla}>{uf.Nome}</option>
        {/each}
      </select>
    </label>
  {/if}
  <br />
  {#if !['Part10', 'Part90'].includes(tipoICMS)}
    <h4>FCP - Substituição Tributária</h4>
    {#if ICMS['vBCFCPST']}
      <p>
        <strong>Base de cálculo:</strong>
        {getMoeda(ICMS['vBCFCPST'])}
      </p>
    {/if}
    <label>
      <i>Percentual do FCP ST</i>
      <input type="number" step="0.0001" bind:value={ICMS['pFCPST']} />
    </label>
    {#if ICMS['vFCPST']}
      <p>
        <strong>Valor:</strong>
        {getMoeda(ICMS['vFCPST'])}
      </p>
    {/if}
    <br />
  {/if}
{/if}
{#if ['60', 'ST41', 'ST60', '500'].includes(tipoICMS)}
  <STRet bind:ICMS pSTRequired={!['ST41', 'ST60'].includes(tipoICMS)} />
  <FCPSTRet bind:ICMS />
  {#if ['ST41', 'ST60'].includes(tipoICMS)}
    <h4>ICMS ST da UF destino</h4>
    <label>
      Base de cálculo
      <input
        type="number"
        step="0.01"
        bind:value={ICMS['vBCSTDest']}
        required
      />
    </label>
    <label>
      Valor
      <input
        type="number"
        step="0.01"
        bind:value={ICMS['vICMSSTDest']}
        required
      />
    </label>
    <br />
  {/if}
  <Efet bind:ICMS />
{/if}
{#if ['20', '30', '40', '41', '50', '70', '90'].includes(tipoICMS)}
  <h4>ICMS desonerado</h4>
  <label>
    <i>Valor do ICMS desonerado</i>
    <input type="number" step="0.01" bind:value={ICMS['vICMSDeson']} />
  </label>
  {#if ICMS['vICMSDeson']}
    <label>
      Motivo da desoneração
      <select bind:value={ICMS['motDesICMS']} required>
        {#each getMotDes(tipoICMS) as e}
          <option value={e[0]}>{e[0]} - {e[1]}</option>
        {/each}
      </select>
    </label>
  {/if}
  <br />
{/if}
{#if ['101', '201', '900'].includes(ICMS['CSOSN'])}
  <h4>Crédito do ICMS</h4>
  <label>
    {#if ICMS['CSOSN'] == '900'}
      <i>Alíquota aplicável de cálculo do crédito</i>
    {:else}
      Alíquota aplicável de cálculo do crédito
    {/if}
    <input
      type="number"
      step="0.0001"
      bind:value={ICMS['pCredSN']}
      required={ICMS['CSOSN'] != '900'}
    />
  </label>
  <label>
    {#if ICMS['CSOSN'] == '900'}
      <i>Valor do crédito que pode ser aproveitado</i>
    {:else}
      Valor do crédito que pode ser aproveitado
    {/if}
    <small>Aproveitado nos termos do art. 23 da LC 123</small>
    <input
      type="number"
      step="0.0001"
      bind:value={ICMS['vCredICMSSN']}
      required={ICMS['CSOSN'] != '900'}
    />
  </label>
  <br />
{/if}
