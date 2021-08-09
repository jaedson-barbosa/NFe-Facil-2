<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Opcional from '../components/Opcional.svelte'

  export let raiz: any

  const el = 'ICMSUFDest'
  $: r = raiz[el]

  $: {
    if (r) {
      r.pICMSInterPart = '100.00'
      r.vICMSUFRemet = '0.00'
    }
  }
</script>

<Opcional {raiz} name={el}>
  <InputT
    bind:val={r['vBCUFDest']}
    lab="Valor da Base de Cálculo do ICMS na UF do destinatário."
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['vBCFCPUFDest']}
    opt
    lab="Valor da Base de Cálculo do FCP na UF do destinatário."
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['pFCPUFDest']}
    opt
    lab="Percentual adicional inserido na alíquota interna da UF de destino, relativo ao FCP naquela UF."
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={r['pICMSUFDest']}
    lab="Alíquota adotada nas operações internas na UF do destinatário para o produto / mercadoria."
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <Select
    bind:val={r['pICMSInter']}
    lab="Alíquota interestadual das UF envolvidas"
    els={[
      ['4.00', 'Alíquota interestadual para produtos importados'],
      ['7.00', 'Sul e Sudeste (exceto ES) destinado ao Norte e Nordeste ou ES'],
      ['12.00', 'Demais casos'],
    ]}
  />
  <InputT
    bind:val={r['vFCPUFDest']}
    opt
    lab="Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) da UF de destino."
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={r['vICMSUFDest']}
    lab="Valor do ICMS de partilha para a UF do destinatário."
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
</Opcional>
