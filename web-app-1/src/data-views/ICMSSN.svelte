<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'

  export let raiz: any

  const el = 'ICMS'
  const elsn = el + 'SN'
  if (!raiz[el]) raiz[el] = {}
  let r =
    Object.values(raiz[el])[0] ?? (raiz[el][elsn + '101'] = { CSOSN: '101' })

  const CSOSN = 'CSOSN'
  $: {
    raiz[el] = {}
    const csosn = r[CSOSN] as string
    const rn =
      elsn + (['102', '103', '300', '400'].includes(csosn) ? '102' : csosn)
    r = raiz[el][rn] = { CSOSN: csosn }
  }
</script>

<Select
  bind:val={r[CSOSN]}
  lab="Código de situação tributária"
  els={[
    ['101', 'Tributado com permissão de crédito'],
    ['102', 'Tributada sem permissão de crédito'],
    ['103', 'Isenção do ICMS para faixa de receita bruta'],
    ['201', 'Tributada com permissão de crédito e com cobrança por ST'],
    ['202', 'Tributada sem permissão de crédito e com cobrança por ST'],
    ['203', 'Isenção para faixa de receita bruta e com cobrança por ST'],
    ['300', 'Imune'],
    ['400', 'Não tributada'],
    ['500', 'Cobrado anteriormente por ST ou por antecipação'],
    ['900', 'Outros'],
  ]}
/>

<Select
  bind:val={r['orig']}
  lab="Origem da mercadoria"
  els={[
    ['0', 'Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8'],
    ['1', 'Estrangeira - Importação direta, exceto a indicada no código 6'],
    [
      '2',
      'Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7',
    ],
    ['3', 'Nacional, conteudo superior 40% e inferior ou igual a 70%'],
    ['4', 'Nacional, processos produtivos básicos'],
    ['5', 'Nacional, importação inferior ou igual a 40%'],
    ['6', 'Estrangeira - Importação direta, sem similar nacional'],
    ['7', 'Estrangeira - Adquirida no mercado interno, sem similar nacional'],
    ['8', 'Nacional, importação superior a 70%'],
  ]}
/>

{#if r[CSOSN] == '900'}
  <Select
    bind:val={r['modBC']}
    lab="Modalidade de determinação da BC do ICMS"
    els={[
      ['0', 'Margem Valor Agregado (%)'],
      ['1', 'Pauta (valor)'],
      ['2', 'Preço Tabelado Máximo (valor)'],
      ['3', 'Valor da Operação'],
    ]}
  />
  <InputT
    bind:val={r['pRedBC']}
    opt
    lab="Percentual de redução da BC"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vBC']}
    lab="Valor da BC do ICMS"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['pICMS']}
    lab="Alíquota do ICMS"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vICMS']}
    lab="Valor do ICMS"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
{#if r[CSOSN] == '500'}
  <InputT
    bind:val={r['vBCSTRet']}
    opt={!['pST', 'vICMSSubstituto', 'vICMSSTRet'].some((v) => r[v])}
    lab="Valor da BC do ICMS ST retido anteriormente"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['pST']}
    lab="Aliquota suportada pelo consumidor final"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vICMSSubstituto']}
    opt
    lab="Valor do ICMS Próprio do Substituto cobrado em operação anterior"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['vICMSSTRet']}
    opt={!['vBCSTRet', 'pST', 'vICMSSubstituto'].some((v) => r[v])}
    lab="Valor do ICMS ST retido anteriormente"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['vBCFCPSTRet']}
    opt={!r['pFCPSTRet'] && !r['vFCPSTRet']}
    lab="Base de cálculo"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['pFCPSTRet']}
    opt={!r['vBCFCPSTRet'] && !r['vFCPSTRet']}
    lab="Percentual"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vFCPSTRet']}
    opt={!r['vBCFCPSTRet'] && !r['pFCPSTRet']}
    lab="Valor"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['pRedBCEfet']}
    opt={!['vBCEfet', 'pICMSEfet', 'vICMSEfet'].some((v) => r[v])}
    lab="Percentual de redução da BC"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vBCEfet']}
    opt={!['pRedBCEfet', 'pICMSEfet', 'vICMSEfet'].some((v) => r[v])}
    lab="Base de cálculo"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['pICMSEfet']}
    opt={!['pRedBCEfet', 'vBCEfet', 'vICMSEfet'].some((v) => r[v])}
    lab="Alíquota"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vICMSEfet']}
    opt={!['pRedBCEfet', 'vBCEfet', 'pICMSEfet'].some((v) => r[v])}
    lab="Valor"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
{#if ['201', '202', '203', '900'].includes(r[CSOSN])}
  <Select
    bind:val={r['modBCST']}
    lab="Modalidade de determinação da BC do ICMS ST"
    els={[
      ['0', 'Preço tabelado ou máximo sugerido'],
      ['1', 'Lista Negativa (valor)'],
      ['2', 'Lista Positiva (valor)'],
      ['3', 'Lista Neutra (valor)'],
      ['4', 'Margem Valor Agregado (%)'],
      ['5', 'Pauta (valor)'],
      ['6', 'Valor da Operação'],
    ]}
  />
  <InputT
    bind:val={r['pMVAST']}
    opt
    lab="Percentual da Margem de Valor Adicionado ICMS ST"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['pRedBCST']}
    opt
    lab="Percentual de redução da BC ICMS ST"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vBCST']}
    lab="Valor da BC do ICMS ST"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['pICMSST']}
    lab="Alíquota do ICMS ST"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vICMSST']}
    lab="Valor do ICMS ST"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['vBCFCPST']}
    opt={!r['pFCPST'] && !r['vFCPST']}
    lab="Base de cálculo"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['pFCPST']}
    opt={!r['vBCFCPST'] && !r['vFCPST']}
    lab="Percentual"
    pat={'0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vFCPST']}
    opt={!r['vBCFCPST'] && !r['pFCPST']}
    lab="Valor"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
{#if ['101', '201', '900'].includes(r[CSOSN])}
  <InputT
    bind:val={r['pCredSN']}
    opt={r[CSOSN] == '900'}
    lab="Alíquota aplicável de cálculo do crédito"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['vCredICMSSN']}
    opt={r[CSOSN] == '900'}
    lab="Valor crédito do ICMS"
    aux="Aproveitado nos termos do art. 23 da LC 123"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
