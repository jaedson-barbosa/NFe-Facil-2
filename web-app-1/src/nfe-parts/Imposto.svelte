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

  export let raiz: any
  export let regimeNormal: boolean

  if (!raiz['imposto']) raiz['imposto'] = {}
  const imposto = raiz['imposto']
</script>

<h3>Impostos</h3>
<InputT
  bind:val={imposto['vTotTrib']}
  opt
  lab="Valor estimado total de impostos federais, estaduais e municipais"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>

<ICMS raiz={imposto} {regimeNormal} />
<ICMSUFDest raiz={imposto} {regimeNormal} />
<IPI raiz={imposto} />
<II raiz={imposto} />
<PIS raiz={imposto} />
<PISST raiz={imposto} />
<COFINS raiz={imposto} />
<COFINSST raiz={imposto} />
