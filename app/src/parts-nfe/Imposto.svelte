<script lang="ts">
  import ICMS from '../parts-imposto/ICMS.svelte'
  import ICMSUFDest from '../parts-imposto/ICMSUFDest.svelte'
  import IPI from '../parts-imposto/IPI.svelte'
  import II from '../parts-imposto/II.svelte'
  import PIS from '../parts-imposto/PIS.svelte'
  import PISST from '../parts-imposto/PISST.svelte'
  import COFINS from '../parts-imposto/COFINS.svelte'
  import COFINSST from '../parts-imposto/COFINSST.svelte'
  import { possuiST } from '../code/imposto/PISCOFINS'

  export let raiz: any
  export let regimeNormal: boolean
  export let consumidorFinal: boolean = false

  if (!raiz['imposto']) raiz['imposto'] = {}
  $: imposto = raiz['imposto']
  $: prod = raiz['prod']

  let informarIPI = !!raiz.imposto.IPI
  $: raiz.imposto.IPI = informarIPI ? {} : undefined

  let informarICMSUFDest = !!raiz.imposto.ICMSUFDest
  $: raiz.imposto.ICMSUFDest = informarICMSUFDest ? {} : undefined
</script>

<h2>Impostos</h2>
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
