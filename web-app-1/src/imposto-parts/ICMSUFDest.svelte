<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Select from '../components/Select.svelte'
  import Opcional from '../components/Opcional.svelte'

  export let raiz: any
  export let regimeNormal: boolean

  $: {
    const ICMSUFDest = raiz['ICMSUFDest']
    if (ICMSUFDest) {
      ICMSUFDest.pICMSInterPart = '100.00'
      ICMSUFDest.vICMSUFRemet = '0.00'
    }
  }
</script>

{#if regimeNormal}
  <Opcional {raiz} name="ICMSUFDest" titulo="ICMS Interestadual" let:r>
    <h4>ICMS Interestadual</h4>
    <InputT
      name="vBCUFDest"
      raiz={r}
      lab="Valor da Base de Cálculo do ICMS na UF do destinatário."
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
    <InputT
      name="vBCFCPUFDest"
      raiz={r}
      opt
      lab="Valor da Base de Cálculo do FCP na UF do destinatário."
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
    <InputT
      name="pFCPUFDest"
      raiz={r}
      opt
      lab="Percentual adicional inserido na alíquota interna da UF de destino, relativo ao FCP naquela UF."
      pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
    <InputT
      name="pICMSUFDest"
      raiz={r}
      lab="Alíquota adotada nas operações internas na UF do destinatário para o produto / mercadoria."
      pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
    />
    <Select
      name="pICMSInter"
      raiz={r}
      lab="Alíquota interestadual das UF envolvidas"
      els={[
        ['4.00', 'Alíquota interestadual para produtos importados'],
        [
          '7.00',
          'Sul e Sudeste (exceto ES) destinado ao Norte e Nordeste ou ES',
        ],
        ['12.00', 'Demais casos'],
      ]}
    />
    <InputT
      name="vFCPUFDest"
      raiz={r}
      opt
      lab="Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) da UF de destino."
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
    <InputT
      name="vICMSUFDest"
      raiz={r}
      lab="Valor do ICMS de partilha para a UF do destinatário."
      pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
    />
  </Opcional>
{/if}
