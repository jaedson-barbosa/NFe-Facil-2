<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import DI from '../prod-parts/DI.svelte'
  import DE from '../prod-parts/DE.svelte'
  import Rastro from '../prod-parts/Rastro.svelte'
  import VeicProd from '../prod-parts/VeicProd.svelte'
  import Med from '../prod-parts/Med.svelte'
  import Arma from '../prod-parts/Arma.svelte'
  import Comb from '../prod-parts/Comb.svelte'
  import NRECOPI from '../prod-parts/NRECOPI.svelte'

  export let raiz: any

  if (!raiz['prod']) raiz['prod'] = {}
  const prod = raiz['prod']

  $: prod['vProd'] = (+prod['qCom'] * +prod['vUnCom']).toFixed(2)

  function calcularQuantidadeEValorTributavel(qCom: string) {
    const qComN = +(qCom ?? 1)
    const vUnCom = +prod['vUnCom']
    const vUnTrib = +prod['vUnTrib']
    prod.qTrib = qComN * vUnCom / vUnTrib
  }

  calcularQuantidadeEValorTributavel(prod['qCom'])
  $: calcularQuantidadeEValorTributavel(prod['qCom'])
</script>

<h3>Dados de {prod['xProd']}</h3>
<InputT
  bind:val={prod['vFrete']}
  opt
  lab="Frete"
  pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={prod['vSeg']}
  opt
  lab="Seguro"
  pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={prod['vDesc']}
  opt
  lab="Desconto"
  pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>
<InputT
  bind:val={prod['vOutro']}
  opt
  lab="Despesas acessórias"
  pat={'0.[0-9]{1}[1-9]{1}|0.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>

<InputT
  bind:val={prod['nFCI']}
  opt
  lab="Número da FCI (Ficha de Conteúdo de Importação)"
  pat={'[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}'}
/>

<DI raiz={prod} />
<DE raiz={prod} />

<Rastro raiz={prod} />

{#if ['veicProd', 'med', 'arma', 'comb', 'nRECOPI'].some((v) => !!v[prod])}
  <h3>Detalhamento específico</h3>
  {#if prod['veicProd']}
    <VeicProd raiz={prod['veicProd']} />
  {/if}
  {#if prod['med']}
    <Med raiz={prod['med']} />
  {/if}
  {#if prod['arma']}
    <Arma raiz={prod['arma']} />
  {/if}
  {#if prod['comb']}
    <Comb raiz={prod['comb']} />
  {/if}
  {#if prod['nRECOPI']}
    <NRECOPI raiz={prod} />
  {/if}
{/if}
