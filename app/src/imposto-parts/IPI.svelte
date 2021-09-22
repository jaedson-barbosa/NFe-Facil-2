<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import { calcular, CST } from '../code/imposto/IPI'
  import { getMoeda } from '../code/numero'

  export let raiz: any
  export let prod: any

  if (!raiz['IPITrib'] && !raiz['IPINT']) raiz['IPITrib'] = { CST: '00' }
  let IPI = raiz['IPITrib'] ?? raiz['IPINT']
  let tipoIPI = IPI['CST']
  $: IPITributado = ['00', '49', '50', '99'].includes(tipoIPI)
  $: {
    if (IPITributado) {
      IPI = raiz['IPITrib'] = { CST: tipoIPI }
      raiz['IPINT'] = undefined
    } else {
      raiz['IPITrib'] = undefined
      IPI = raiz['IPINT'] = { CST: tipoIPI }
    }
  }

  IPI['vIPI'] = calcular(prod, IPI)
  $: IPI['vIPI'] = calcular(prod, IPI)
</script>

<h4>Imposto sobre produtos industrializados</h4>
<InputT
  {raiz}
  name="CNPJProd"
  opt
  lab="CNPJ do produtor da mercadoria"
  aux="Informar se diferente do emitente e somente em exportação"
  pat={'[0-9]{14}'}
  max={14}
  mask="cnpj"
/>
<InputT
  {raiz}
  name="qSelo"
  opt
  lab="Quantidade de selos de controle"
  pat={'[0-9]{1,12}'}
/>
<InputT
  {raiz}
  name="cSelo"
  opt
  lab="Códigos dos selos de controle"
  min={1}
  max={60}
/>
<InputT
  {raiz}
  name="cEnq"
  lab="Código de Enquadramento Legal"
  min={1}
  max={3}
/>
<Select bind:val={tipoIPI} lab="Código da Situação Tributária" els={CST} />
{#if IPITributado}
  {#if !raiz['vUnid']}
    <p>
      A base de cálculo considerada é igual ao somatório valor do produto +
      frete + seguro + outras despesas acessórias.
    </p>
    <InputT
      {raiz}
      name="pIPI"
      lab="Alíquota do IPI"
      pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
  {/if}
  {#if !raiz['pIPI']}
    <p>A quantidade considerada é a quantidade tributável.</p>
    <InputT
      {raiz}
      name="vUnid"
      lab="Valor por Unidade Tributável"
      pat={'0|0.[0-9]{4}|[1-9]{1}[0-9]{0,10}(.[0-9]{4})?'}
    />
  {/if}
  {#if IPI['vIPI']}
    <strong>IPI calculado:</strong>
    {getMoeda(IPI['vIPI'])}
  {/if}
{/if}
