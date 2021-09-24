<script lang="ts">
  import { calcular, CST } from '../code/imposto/PISCOFINS'
  import { getMoeda } from '../code/numero'
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'

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
<Select bind:val={tipoCOFINS} lab="CST" els={CST} />
{#if comAliquota}
  {#if aliquotaEmPercentual}
    <p>A base de cálculo considerada é o valor total bruto do produto.</p>
    <InputT
      bind:val={COFINS['pCOFINS']}
      lab="Alíquota em percentual"
      pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
  {/if}
  {#if aliquotaEmReais}
    <p>A quantidade considerada é a quantidade tributável.</p>
    <InputT
      bind:val={COFINS['vAliqProd']}
      lab="Alíquota em reais"
      pat={'0|0.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(.[0-9]{1,4})?'}
    />
  {/if}
  {#if COFINS['vCOFINS']}
    <p>
      <strong>COFINS calculado:</strong>
      {getMoeda(COFINS['vCOFINS'])}
    </p>
  {/if}
{/if}
