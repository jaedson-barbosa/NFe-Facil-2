<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Estado from '../components/Estado.svelte'
  import {
    CSOSN,
    CST,
    origem,
    getMotDes,
    modBC,
    modBCST,
  } from '../code/imposto/ICMS'

  export let raiz: any
  export let regimeNormal: boolean

  const CS = regimeNormal ? CST : CSOSN

  if (!raiz['ICMS']) raiz['ICMS'] = {}
  let ICMS =
    Object.values(raiz['ICMS'])[0] ?? regimeNormal
      ? (raiz['ICMS']['ICMS00'] = { CST: '00' })
      : (raiz['ICMS']['ICMSSN101'] = { CSOSN: '101' })

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
</script>

<h4>ICMS</h4>
<Select bind:val={tipoICMS} lab="Código de situação" els={CS} />
<Select bind:val={ICMS['orig']} lab="Origem da mercadoria" els={origem} />
{#if ['00', '10', '20', '51', '70', '90', 'Part10', 'Part90', '900'].includes(tipoICMS)}
  <Select
    bind:val={ICMS['modBC']}
    opt={tipoICMS == '51'}
    lab="Modalidade de determinação da BC do ICMS"
    els={modBC}
  />
  {#if ['20', '51', '70', '90', 'Part10', 'Part90', '900'].includes(tipoICMS)}
    <InputT
      bind:val={ICMS['pRedBC']}
      opt={tipoICMS != '20'}
      lab="Percentual de redução da BC"
      pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
  {/if}
  <InputT
    bind:val={ICMS['vBC']}
    opt={tipoICMS == '51'}
    lab="Valor da BC do ICMS"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={ICMS['pICMS']}
    opt={tipoICMS == '51'}
    lab="Alíquota do ICMS"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  {#if tipoICMS == '51'}
    <InputT
      bind:val={ICMS['vICMSOp']}
      opt
      lab="Valor do ICMS da Operação"
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
    <InputT
      bind:val={ICMS['pDif']}
      opt
      lab="Percentual do diferemento"
      pat={'0(.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(.[0-9]{2,4})?|100(.0{2,4})?'}
    />
    <InputT
      bind:val={ICMS['vICMSDif']}
      opt
      lab="Valor do ICMS da diferido"
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
  {/if}
  <InputT
    bind:val={ICMS['vICMS']}
    opt={tipoICMS == '51'}
    lab="Valor do ICMS"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
{#if ['00', '10', '20', '51', '70', '90'].includes(tipoICMS)}
  {#if tipoICMS != '00'}
    <InputT
      bind:val={ICMS['vBCFCP']}
      opt={!ICMS['pFCP'] && !ICMS['vFCP']}
      lab="Base de cálculo"
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
  {/if}
  <InputT
    bind:val={ICMS['pFCP']}
    opt={!ICMS['vBCFCP'] && !ICMS['vFCP']}
    lab="Percentual"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vFCP']}
    opt={!ICMS['vBCFCP'] && !ICMS['pFCP']}
    lab="Valor"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
{#if ['10', '30', '70', '90', 'Part10', 'Part90', '201', '202', '203', '900'].includes(tipoICMS)}
  <Select
    bind:val={ICMS['modBCST']}
    lab="Modalidade de determinação da BC do ICMS ST"
    els={modBCST}
  />
  <InputT
    bind:val={ICMS['pMVAST']}
    opt
    lab="Percentual da Margem de Valor Adicionado ICMS ST"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['pRedBCST']}
    opt
    lab="Percentual de redução da BC ICMS ST"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vBCST']}
    lab="Valor da BC do ICMS ST"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={ICMS['pICMSST']}
    lab="Alíquota do ICMS ST"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vICMSST']}
    lab="Valor do ICMS ST"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
{#if ['10', '30', '60', '70', '90', '201', '202', '203', '900'].includes(tipoICMS)}
  <InputT
    bind:val={ICMS['vBCFCPST']}
    opt={!ICMS['pFCPST'] && !ICMS['vFCPST']}
    lab="Base de cálculo"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={ICMS['pFCPST']}
    opt={!ICMS['vBCFCPST'] && !ICMS['vFCPST']}
    lab="Percentual"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vFCPST']}
    opt={!ICMS['vBCFCPST'] && !ICMS['pFCPST']}
    lab="Valor"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
{#if ['60', 'ST41', 'ST60', '500'].includes(tipoICMS)}
  <InputT
    bind:val={ICMS['vBCSTRet']}
    opt={!['pST', 'vICMSSubstituto', 'vICMSSTRet'].some((v) => ICMS[v])}
    lab="Valor da BC do ICMS ST retido anteriormente"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={ICMS['pST']}
    opt={['ST41', 'ST60'].includes(tipoICMS) ||
      !['vBCSTRet', 'vICMSSubstituto', 'vICMSSTRet'].some((v) => ICMS[v])}
    lab="Aliquota suportada pelo consumidor final"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vICMSSubstituto']}
    opt
    lab="Valor do ICMS Próprio do Substituto cobrado em operação anterior"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={ICMS['vICMSSTRet']}
    opt={!['vBCSTRet', 'pST', 'vICMSSubstituto'].some((v) => ICMS[v])}
    lab="Valor do ICMS ST retido anteriormente"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
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
  {#if ['ST41', 'ST60'].includes(tipoICMS)}
    <InputT
      bind:val={ICMS['vBCSTDest']}
      lab="Informar o valor da BC do ICMS ST da UF destino"
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
    <InputT
      bind:val={ICMS['vICMSSTDest']}
      lab="Informar o valor da BC do ICMS ST da UF destino"
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
  {/if}
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
{/if}
{#if ['20', '30', '40', '41', '50', '70', '90'].includes(tipoICMS)}
  <InputT
    bind:val={ICMS['vICMSDeson']}
    opt={!ICMS['motDesICMS']}
    lab="Valor do ICMS desonerado"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <Select
    bind:val={ICMS['motDesICMS']}
    opt={!ICMS['vICMSDeson']}
    lab="Motivo da desoneração"
    els={getMotDes(tipoICMS)}
  />
{/if}
{#if ['Part10', 'Part90'].includes(tipoICMS)}
  <InputT
    bind:val={ICMS['pBCOp']}
    lab="% para determinação do valor da BC da operação própria."
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <Estado
    bind:UF={ICMS['UFST']}
    lab="Sigla da UF para qual é devido o ICMS ST da operação."
    incluirEX
  />
{/if}
{#if ['101', '201', '900'].includes(ICMS['CSOSN'])}
  <InputT
    bind:val={ICMS['pCredSN']}
    opt={ICMS['CSOSN'] == '900'}
    lab="Alíquota aplicável de cálculo do crédito"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={ICMS['vCredICMSSN']}
    opt={ICMS['CSOSN'] == '900'}
    lab="Valor crédito do ICMS"
    aux="Aproveitado nos termos do art. 23 da LC 123"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
