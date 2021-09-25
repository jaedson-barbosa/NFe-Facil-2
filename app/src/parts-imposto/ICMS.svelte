<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import {
    CSOSN,
    CST,
    origem,
    getMotDes,
    modBC,
    modBCST,
    calcular,
  } from '../code/imposto/ICMS'
  import { getMoeda } from '../code/numero'
  import { EstadosEX } from '../code/IBGE'

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
  <h4>ICMS próprio</h4>
  <label>
    Modalidade de determinação da BC
    <select bind:value={ICMS['modBC']} required={tipoICMS != '51'}>
      {#each modBC as e}
        <option value={e[0]}>{e[0]} - {e[1]}</option>
      {/each}
    </select>
  </label>
  {#if !['00', '10'].includes(tipoICMS)}
    <InputT
      bind:val={ICMS['pRedBC']}
      opt={tipoICMS != '20'}
      lab="Percentual de redução da BC"
      pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
  {/if}
  {#if ICMS['vBC']}
    <p>
      <strong>Valor da BC do ICMS</strong>
      {getMoeda(ICMS['vBC'])}
      <br />
      <small>
        Aqui é usada a fórmula mais comum, valor do produto + frete + seguro +
        adicionais - desconto {consumidorFinal ? '+ ipi' : ''}. Caso aplicável,
        o resultado deste somatório é multiplicado por 1 - redução / 100.
      </small>
    </p>
  {/if}
  <InputT
    bind:val={ICMS['pICMS']}
    opt={tipoICMS == '51'}
    lab="Alíquota"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  {#if tipoICMS == '51'}
    {#if ICMS['vICMSOp']}
      <p>
        <strong>Valor do ICMS da Operação:</strong>
        {getMoeda(ICMS['vICMSOp'])}
      </p>
    {/if}
    <label>
      <i>Percentual do diferemento</i>
      <input type="number" step="0.0001" bind:value={ICMS['pDif']} />
    </label>
    {#if ICMS['vICMSDif']}
      <p>
        <strong>Valor do ICMS diferido:</strong>
        {getMoeda(ICMS['vICMSDif'])}
      </p>
    {/if}
  {/if}
  <p>
    <strong>Valor do ICMS</strong>
    {getMoeda(ICMS['vICMS'])}
  </p>
  <br />
  {#if !['Part10', 'Part90', '900'].includes(tipoICMS)}
    <h4>Fundo de Combate à Pobreza</h4>
    {#if ICMS['vBCFCP']}
      <p>
        <strong>Base de cálculo:</strong>
        {getMoeda(ICMS['vBCFCP'])}
      </p>
    {/if}
    <InputT
      bind:val={ICMS['pFCP']}
      opt={!ICMS['vBCFCP'] && !ICMS['vFCP']}
      lab="Percentual"
      pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
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
    Alíquota do ST"
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
    <InputT
      bind:val={ICMS['pFCPST']}
      opt={!ICMS['vBCFCPST'] && !ICMS['vFCPST']}
      lab="Percentual do FCP ST"
      pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
    {#if ICMS['vFCPST']}
      <p>
        <strong>Valor:</strong>
        {getMoeda(ICMS['vFCPST'])}
      </p>
    {/if}
    <br />
  {/if}
{/if}
{#if ['20', '30', '40', '41', '50', '60', '70', '90', 'ST41', 'ST60', '101', '201', '500', '900'].includes(tipoICMS)}
  <p>
    Aviso: Deste ponto em diante os campos do ICMS não tem nenhum tipo de
    automação.
  </p>
{/if}
{#if ['60', 'ST41', 'ST60', '500'].includes(tipoICMS)}
  <h4>ICMS cobrado anteriormente por ST</h4>
  <InputT
    bind:val={ICMS['vBCSTRet']}
    opt={!['pST', 'vICMSSubstituto', 'vICMSSTRet'].some((v) => ICMS[v])}
    lab="BC do ICMS ST cobrado anteriormente"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={ICMS['pST']}
    opt={['ST41', 'ST60'].includes(tipoICMS) ||
      !['vBCSTRet', 'vICMSSubstituto', 'vICMSSTRet'].some((v) => ICMS[v])}
    lab="Aliquota suportada pelo consumidor final"
    aux="Alíquota do cálculo do ICMS-ST já incluso o FCP caso incida sobre a mercadoria"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <label>
    <i>ICMS próprio do substituto cobrado anteriormente</i>
    <input type="number" step="0.01" bind:value={ICMS['vICMSSubstituto']} />
  </label>
  <InputT
    bind:val={ICMS['vICMSSTRet']}
    opt={!['vBCSTRet', 'pST', 'vICMSSubstituto'].some((v) => ICMS[v])}
    lab="ICMS ST cobrado anteriormente"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <br />
  <h4>FCP retido anteriormente por ST</h4>
  <InputT
    bind:val={ICMS['vBCFCPSTRet']}
    opt={!ICMS['pFCPSTRet'] && !ICMS['vFCPSTRet']}
    lab="Base de cálculo"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={ICMS['pFCPSTRet']}
    opt={!ICMS['vBCFCPSTRet'] && !ICMS['vFCPSTRet']}
    lab="Percentual"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vFCPSTRet']}
    opt={!ICMS['vBCFCPSTRet'] && !ICMS['pFCPSTRet']}
    lab="Valor"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <br />
  {#if ['ST41', 'ST60'].includes(tipoICMS)}
    <h4>ICMS ST da UF destino</h4>
    <label>
      Base de cálculo
      <input type="number" step="0.01" bind:value={ICMS['vBCSTDest']} required />
    </label>
    <label>
      Valor
      <input type="number" step="0.01" bind:value={ICMS['vICMSSTDest']} required />
    </label>
    <br />
  {/if}
  <h4>ICMS efetivo</h4>
  <InputT
    bind:val={ICMS['pRedBCEfet']}
    opt={!['vBCEfet', 'pICMSEfet', 'vICMSEfet'].some((v) => ICMS[v])}
    lab="Percentual de redução da BC"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vBCEfet']}
    opt={!['pRedBCEfet', 'pICMSEfet', 'vICMSEfet'].some((v) => ICMS[v])}
    lab="Base de cálculo"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={ICMS['pICMSEfet']}
    opt={!['pRedBCEfet', 'vBCEfet', 'vICMSEfet'].some((v) => ICMS[v])}
    lab="Alíquota"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vICMSEfet']}
    opt={!['pRedBCEfet', 'vBCEfet', 'pICMSEfet'].some((v) => ICMS[v])}
    lab="Valor"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <br />
{/if}
{#if ['20', '30', '40', '41', '50', '70', '90'].includes(tipoICMS)}
  <h4>ICMS desonerado</h4>
  <InputT
    bind:val={ICMS['vICMSDeson']}
    opt={!ICMS['motDesICMS']}
    lab="Valor do ICMS desonerado"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <label>
    Motivo da desoneração
    <select bind:value={ICMS['motDesICMS']} required={ICMS['vICMSDeson']}>
      {#each getMotDes(tipoICMS) as e}
        <option value={e[0]}>{e[0]} - {e[1]}</option>
      {/each}
    </select>
  </label>
  <br />
{/if}
{#if ['101', '201', '900'].includes(ICMS['CSOSN'])}
  <h4>Crédito do ICMS</h4>
  <InputT
    bind:val={ICMS['pCredSN']}
    opt={ICMS['CSOSN'] == '900'}
    lab="Alíquota aplicável de cálculo do crédito"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vCredICMSSN']}
    opt={ICMS['CSOSN'] == '900'}
    lab="Valor do crédito que pode ser aproveitado"
    aux="Aproveitado nos termos do art. 23 da LC 123"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <br />
{/if}
