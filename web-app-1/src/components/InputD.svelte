<script context="module">
  function createId(length = 20) {
    const AUTO_ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return [...Array(length)]
      .map(() => {
        const index = Math.floor(Math.random() * AUTO_ID_CHARS.length);
        return AUTO_ID_CHARS.charAt(index);
      })
      .join('');
  }
</script>
<script lang="ts">
  import { toNFeString } from '../code/getDataString'
  import Opcional from './Opcional.svelte'

  export let raiz: any
  export let name: string
  export let opt = false
  export let lab: string
  export let aux = ''

  if (!raiz[name] && !opt) raiz[name] = toNFeString(new Date())
  let val = raiz[name]

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
