<script lang="ts">
  import { calcular, CST } from '../code/imposto/PISCOFINS'
  import { getMoeda } from '../code/numero'
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'

  export let raiz: any
  export let prod: any

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
  $: PIS = calcular(prod, PIS, 'PIS')
</script>

<h4>PIS</h4>
<Select bind:val={tipoPIS} lab="CST" els={CST} />
{#if comAliquota}
  {#if aliquotaEmPercentual}
    <p>A base de cálculo considerada é o valor total bruto do produto.</p>
    <InputT
      bind:val={PIS['pPIS']}
      lab="Alíquota em percentual"
      pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
  {/if}
  {#if aliquotaEmReais}
    <p>A quantidade considerada é a quantidade tributável.</p>
    <InputT
      bind:val={PIS['vAliqProd']}
      lab="Alíquota em reais"
      pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?'}
    />
  {/if}
  {#if PIS['vPIS']}
    <p>
      <strong>PIS calculado:</strong>
      {getMoeda(PIS['vPIS'])}
    </p>
  {/if}
{/if}
