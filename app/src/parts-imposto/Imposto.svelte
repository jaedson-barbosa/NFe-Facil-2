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

  export let imposto: any
  export let regimeNormal: boolean

  if (!imposto) imposto = {}

  let informarIPI = !!imposto.IPI
  $: imposto.IPI = informarIPI ? {} : undefined

  let informarICMSUFDest = !!imposto.ICMSUFDest
  $: imposto.ICMSUFDest = informarICMSUFDest ? {} : undefined

  $: {
    const pisst = possuiST(imposto, 'PIS')
    if (pisst && !imposto.PISST) imposto.PISST = {}
    if (!pisst && imposto.PISST) imposto.PISST = undefined
    const cofinsst = possuiST(imposto, 'COFINS')
    if (cofinsst && !imposto.COFINSST) imposto.COFINSST = {}
    if (!cofinsst && imposto.COFINSST) imposto.COFINSST = undefined
  }
</script>

<h2>Impostos</h2>
<label>
  <input type="checkbox" bind:checked={informarIPI} />
  Produto com incidência de IPI
</label>
{#if imposto.IPI}
  <IPI bind:raiz={imposto.IPI} />
{/if}
<PIS bind:raiz={imposto} />
{#if imposto.PISST}
  <PISST bind:raiz={imposto.PISST} />
{/if}
<COFINS bind:raiz={imposto} />
{#if imposto.COFINSST}
  <COFINSST bind:raiz={imposto.COFINSST} />
{/if}
<ICMS
  bind:raiz={imposto}
  {regimeNormal}
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
