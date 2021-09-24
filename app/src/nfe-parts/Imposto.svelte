<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import ICMS from '../imposto-parts/ICMS.svelte'
  import ICMSUFDest from '../imposto-parts/ICMSUFDest.svelte'
  import IPI from '../imposto-parts/IPI.svelte'
  import II from '../imposto-parts/II.svelte'
  import PIS from '../imposto-parts/PIS.svelte'
  import PISST from '../imposto-parts/PISST.svelte'
  import COFINS from '../imposto-parts/COFINS.svelte'
  import COFINSST from '../imposto-parts/COFINSST.svelte'
  import { possuiST } from '../code/imposto/PISCOFINS'

  export let raiz: any
  export let regimeNormal: boolean
  export let consumidorFinal: boolean = false

  if (!raiz['imposto']) raiz['imposto'] = {}
  let imposto = raiz['imposto']

  $: prod = raiz['prod']

  let informarIPI = !!imposto.IPI
  $: imposto.IPI = informarIPI ? {} : undefined

  let informarICMSUFDest = !!imposto.ICMSUFDest
  $: imposto.ICMSUFDest = informarICMSUFDest ? {} : undefined
</script>

<h2>Impostos</h2>
<InputT
  bind:val={imposto['vTotTrib']}
  opt
  lab="Valor estimado total de impostos federais, estaduais e municipais"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>

<label>
  <input type="checkbox" bind:checked={informarIPI} />
  Produto com incidência de IPI
</label>
{#if imposto.IPI}
  <IPI raiz={imposto.IPI} {prod} />
{/if}
<PIS bind:raiz={imposto} {prod} />
{#if possuiST(imposto, 'PIS')}
  <PISST bind:raiz={imposto.PISST} {prod} />
{/if}
<COFINS bind:raiz={imposto} {prod} />
{#if possuiST(imposto, 'COFINS')}
  <COFINSST bind:raiz={imposto.COFINSST} {prod} />
{/if}
<ICMS
  bind:raiz={imposto}
  {regimeNormal}
  {prod}
  ipi={imposto.IPI}
  {consumidorFinal}
/>
{#if regimeNormal}
  <label>
    <input type="checkbox" bind:checked={informarIPI} />
    Produto com incidência de ICMS Interestadual
  </label>
  {#if imposto.ICMSUFDest}
    <ICMSUFDest raiz={imposto.ICMSUFDest} />
  {/if}
{/if}
<II bind:II={imposto.II} />
