<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Opcional from '../components/Opcional.svelte'

  export let raiz: any

  if (!raiz['total']) raiz['total'] = {}
  const total = raiz['total']

  if (!total['ICMSTot']) total['ICMSTot'] = {}
  const ICMSTot = total['ICMSTot']

  $: retTrib = total['retTrib']
</script>

<h3>Totais</h3>
<h4>Referentes ao ICMS</h4>
<InputT
  bind:val={ICMSTot['vBC']}
  lab="BC do ICMS"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vICMS']}
  lab="Total do ICMS"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vICMSDeson']}
  lab="Total do ICMS desonerado"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vFCPUFDest']}
  opt
  lab="Total do ICMS relativo ao FCP para a UF de destino"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vICMSUFDest']}
  opt
  lab="Total do ICMS de partilha para a UF do destinatário"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vICMSUFRemet']}
  opt
  lab="Total do ICMS de partilha para a UF do remetente"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vFCP']}
  lab="Total do FCP (Fundo de Combate à Pobreza)."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vBCST']}
  lab="BC do ICMS ST"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vST']}
  lab="Total do ICMS ST"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vFCPST']}
  lab="Total do FCP retido por ST."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vFCPSTRet']}
  lab="Total do FCP retido anteriormente por ST."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vProd']}
  lab="Total dos produtos e serviços"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vFrete']}
  lab="Total do frete"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vSeg']}
  lab="Total do seguro"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vDesc']}
  lab="Total do desconto"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vII']}
  lab="Total do II"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vIPI']}
  lab="Total do IPI"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vIPIDevol']}
  lab="Total do IPI devolvido."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vPIS']}
  lab="Total do PIS"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vCOFINS']}
  lab="Total do COFINS"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vOutro']}
  lab="Outras Despesas acessórias"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vNF']}
  lab="Total da NF-e"
  aux="Caso informado, o total dos serviços sob não-incidência ou não tributados pelo ICMS deve ser somado a este campo."
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={ICMSTot['vTotTrib']}
  opt
  lab="Total estimado de impostos federais, estaduais e municipais"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>

<h4>Retenção de tributos</h4>
<Opcional raiz={total} name="retTrib">
  <InputT
    bind:val={retTrib['vRetPIS']}
    opt
    lab="Valor Retido de PIS"
    pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTrib['vRetCOFINS']}
    opt
    lab="Valor Retido de COFINS"
    pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTrib['vRetCSLL']}
    opt
    lab="Valor Retido de CSLL"
    pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTrib['vBCIRRF']}
    opt
    lab="Base de Cálculo do IRRF"
    pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTrib['vIRRF']}
    opt
    lab="Valor Retido de IRRF"
    pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTrib['vBCRetPrev']}
    opt
    lab="Base de Cálculo da Retenção da Previdêncica Social"
    pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTrib['vRetPrev']}
    opt
    lab="Valor da Retenção da Previdêncica Social"
    pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
</Opcional>
