<script lang="ts">
  import { toNFeString } from '../code/getDataString'
  import idAleatorio from '../code/idAleatorio'
  import Opcional from './Opcional.svelte'

  export let raiz: any
  export let name: string
  export let opt = false
  export let lab: string
  export let aux = ''

  if (!raiz[name] && !opt) raiz[name] = toNFeString(new Date())
  let val = raiz[name]

  $: raiz[name] = toNFeString(new Date(val))
  const id = idAleatorio()
</script>

<label for={id}>
  {#if opt}
    <i>{lab}</i>
  {:else}
    {lab}
  {/if}
  {#if aux}
    <small>{aux}</small>
  {/if}
</label>
{#if opt}
  <Opcional {raiz} {name}>
    <input {id} required type="datetime" bind:value={val} />
  </Opcional>
{:else}
  <input {id} required type="datetime" bind:value={val} />
{/if}
