<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Opcional from '../components/Opcional.svelte'
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
  export let consumidorFinal: boolean = false

  if (!raiz['imposto']) raiz['imposto'] = {}
  let imposto = raiz['imposto']

  $: prod = raiz['prod']
  $: ipi = imposto.IPI
</script>

<h2>Impostos</h2>
<InputT
  bind:val={imposto['vTotTrib']}
  opt
  lab="Valor estimado total de impostos federais, estaduais e municipais"
  pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
/>

<Opcional bind:raiz={imposto} name="IPI" titulo="IPI" let:r>
  <IPI raiz={r} {prod} />
</Opcional>
<PIS bind:raiz={imposto} {prod} />
<Opcional bind:raiz={imposto} name="PISST" titulo="PIS ST" let:r>
  <PISST raiz={r} {prod} />
</Opcional>
<COFINS bind:raiz={imposto} {prod} />
<Opcional bind:raiz={imposto} name="COFINSST" titulo="COFINS ST" let:r>
  <COFINSST raiz={r} {prod} />
</Opcional>
<ICMS bind:raiz={imposto} {regimeNormal} {prod} {ipi} {consumidorFinal} />
<!-- É bom melhorar essa validação usando como base a validação, da pra ficar mais especifico e remover o Opcional -->
{#if regimeNormal}
  <Opcional
    bind:raiz={imposto}
    name="ICMSUFDest"
    titulo="ICMS Interestadual"
    let:r
  >
    <ICMSUFDest raiz={r} />
  </Opcional>
{/if}
<II bind:raiz={imposto} />
