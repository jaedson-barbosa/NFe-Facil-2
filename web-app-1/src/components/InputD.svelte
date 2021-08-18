<script lang="ts">
  import { createId } from '../app/helpers'
  import Opcional from './Opcional.svelte'

  export let raiz: any
  export let name: string
  export let opt = false
  export let lab: string
  export let aux = ''

  if (!raiz[name] && !opt) raiz[name] = toNFeString(new Date())
  let val = raiz[name]

  function toNFeString(data: Date) {
    const tzo = -data.getTimezoneOffset()
    const dif = tzo >= 0 ? '+' : '-'

    function pad(num: number) {
      var norm = Math.floor(Math.abs(num))
      return (norm < 10 ? '0' : '') + norm
    }

    return (
      data.getFullYear() +
      '-' +
      pad(data.getMonth() + 1) +
      '-' +
      pad(data.getDate()) +
      'T' +
      pad(data.getHours()) +
      ':' +
      pad(data.getMinutes()) +
      ':' +
      pad(data.getSeconds()) +
      dif +
      pad(tzo / 60) +
      ':' +
      pad(tzo % 60)
    )
  }

  $: raiz[name] = toNFeString(new Date(val))
  const id = createId()
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
