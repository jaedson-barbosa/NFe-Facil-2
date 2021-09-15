<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'

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
</script>

<h4>PIS</h4>
<Select
  bind:val={tipoPIS}
  lab="Código de Situação Tributária"
  els={[
    ['01', 'Alíquota Normal (Cumulativo/Não Cumulativo)'],
    ['02', 'Alíquota Diferenciada'],
    ['03', 'Tributado por quantidade'],
    ['04', 'Operação com tributação monofásica (Alíquota Zero)'],
    ['05', 'Operação Tributável (ST)'],
    ['06', 'Operação Tributável - Alíquota Zero'],
    ['07', 'Operação Isenta da contribuição'],
    ['08', 'Operação sem incidência da contribuição'],
    ['09', 'Operação com suspensão da contribuição'],
    ['49', 'Outras Operações de Saída;'],
    [
      '50',
      'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno;',
    ],
    [
      '51',
      'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno;',
    ],
    [
      '52',
      'Operação com Direito a Crédito – Vinculada Exclusivamente a Receita de Exportação;',
    ],
    [
      '53',
      'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno;',
    ],
    [
      '54',
      'Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação;',
    ],
    [
      '55',
      'Operação com Direito a Crédito - Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação;',
    ],
    [
      '56',
      'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação;',
    ],
    [
      '60',
      'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno;',
    ],
    [
      '61',
      'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno;',
    ],
    [
      '62',
      'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação;',
    ],
    [
      '63',
      'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno;',
    ],
    [
      '64',
      'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação;',
    ],
    [
      '65',
      'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação;',
    ],
    [
      '66',
      'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação;',
    ],
    ['67', 'Crédito Presumido - Outras Operações;'],
    ['70', 'Operação de Aquisição sem Direito a Crédito;'],
    ['71', 'Operação de Aquisição com Isenção;'],
    ['72', 'Operação de Aquisição com Suspensão;'],
    ['73', 'Operação de Aquisição a Alíquota Zero;'],
    ['74', 'Operação de Aquisição; sem Incidência da Contribuição;'],
    ['75', 'Operação de Aquisição por Substituição Tributária;'],
    ['98', 'Outras Operações de Entrada;'],
    ['99', 'Outras Operações;'],
  ]}
/>
{#if !['04', '05', '06', '07', '08', '09'].includes(PIS['CST'])}
  {#if PIS['CST'] != '03' && !PIS['qBCProd'] && !PIS['vAliqProd']}
    <InputT
      bind:val={PIS['vBC']}
      lab="Valor da BC do PIS"
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
    <InputT
      bind:val={PIS['pPIS']}
      lab="Alíquota do PIS (em percentual)"
      pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
  {/if}
  {#if PIS['CST'] != '01' && PIS['CST'] != '02' && !PIS['vBC'] && !PIS['pPIS']}
    <InputT
      bind:val={PIS['qBCProd']}
      lab="Quantidade Vendida"
      pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(.[0-9]{1,4})?'}
    />
    <InputT
      bind:val={PIS['vAliqProd']}
      lab="Alíquota do PIS (em reais)"
      pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?'}
    />
  {/if}
  <InputT
    bind:val={PIS['vPIS']}
    lab="Valor do PIS"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
{/if}
