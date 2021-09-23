<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'

  export let raiz: any

  raiz.pICMSInterPart = '100.00'
  raiz.vICMSUFRemet = '0.00'
</script>

<h3>ICMS Interestadual</h3>
<p>
  Deve ser preenchido apenas nas vendas interestaduais para consumidor final não
  contribuinte do ICMS.
</p>
<InputT
  name="vBCUFDest"
  {raiz}
  lab="Valor da Base de Cálculo do ICMS na UF do destinatário."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  name="vBCFCPUFDest"
  {raiz}
  opt
  lab="Valor da Base de Cálculo do FCP na UF do destinatário."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  name="pFCPUFDest"
  {raiz}
  opt
  lab="Percentual adicional inserido na alíquota interna da UF de destino, relativo ao FCP naquela UF."
  pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
/>
<InputT
  name="pICMSUFDest"
  {raiz}
  lab="Alíquota adotada nas operações internas na UF do destinatário para o produto / mercadoria."
  pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
/>
<Select
  name="pICMSInter"
  {raiz}
  lab="Alíquota interestadual das UF envolvidas"
  els={[
    ['4.00', 'Alíquota interestadual para produtos importados'],
    ['7.00', 'Sul e Sudeste (exceto ES) destinado ao Norte e Nordeste ou ES'],
    ['12.00', 'Demais casos'],
  ]}
/>
<InputT
  name="vFCPUFDest"
  {raiz}
  opt
  lab="Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) da UF de destino."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  name="vICMSUFDest"
  {raiz}
  lab="Valor do ICMS de partilha para a UF do destinatário."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
