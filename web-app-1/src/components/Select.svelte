<script lang="ts">
  export let opt = false
  export let lab: string
  export let aux = ''
  export let val: string
  export let els: [string, string][]
</script>

<label>
  {#if opt}
    <i>{lab}</i>
  {:else}
    {lab}
  {/if}
  {#if aux}
    <small>{aux}</small>
  {/if}
  <select bind:value={val} required={!opt}>
    {#each els as e}
      <option value={e[0]}>{e[1]}</option>
    {/each}
  </select>
</label>
