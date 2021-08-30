<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Lista from '../components/Lista.svelte'

  export let raiz: any
  export let total: number

  if (!raiz['pag']) raiz['pag'] = {}
  const pag = raiz['pag']
  if (!pag.detPag) pag.detPag = []
  const detPag = pag.detPag

  function calcularTroco() {
    pag['vTroco'] = pag.reduce((p, c) => p + c.vPag ?? 0) - total
  }
</script>

<h3>Pagamento</h3>
<Lista raiz={pag} name="detPag">
  <svelte:fragment slot="h" let:item>
    {(+(item['vPag'] ?? '0')).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })} ({item['tPag']})
  </svelte:fragment>
  <svelte:fragment slot="b" let:item>
    <Select
      raiz={item.detPag}
      name='indPag'
      opt
      lab="Indicador da Forma de Pagamento"
      els={[
        ['0', 'Pagamento à Vista'],
        ['1', 'Pagamento à Prazo'],
      ]}
    />
    <Select
      raiz={item.detPag}
      name='tPag'
      lab="Forma de Pagamento"
      els={[
        ['01', 'Dinheiro'],
        ['02', 'Cheque'],
        ['03', 'Cartão de crédito'],
        ['04', 'Cartão de débito'],
        ['05', 'Crédito Loja'],
        ['10', 'Vale Alimentação'],
        ['11', 'Vale Refeição'],
        ['12', 'Vale Presente'],
        ['13', 'Vale Combustível'],
        ['14', 'Duplicata Mercantil'],
        ['15', 'Boleto Bancario'],
        ['16', 'Depósito Bancário'],
        ['17', 'Pagamento Instantâneo (PIX)'],
        ['18', 'Transferência bancária, Carteira Digital'],
        ['19', 'Programa de fidelidade, Cashback, Crédito Virtual'],
        ['90', 'Sem Pagamento'],
        ['99', 'Outros'],
      ]}
    />
    {#if item.detPag['tPag'] == '99'}
      <InputT
        raiz={item.detPag}
        name='xPag'
        opt
        lab="Descrição do Meio de Pagamento"
        min={2}
        max={60}
      />
    {/if}
    {#if item.detPag['tPag'] != 90}
      <InputT
        raiz={item.detPag}
        name='vPag'
        lab="Valor do Pagamento"
        pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
      />
    {/if}
  </svelte:fragment>
</Lista>
<InputT
  bind:val={pag['vTroco']}
  opt
  lab="Valor do Troco"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<button on:click={calcularTroco}>Calcular troco</button>
