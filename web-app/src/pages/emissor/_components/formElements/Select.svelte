<script lang="ts">
  export let annotation: {
    label: string
    aux?: string
    itens?: string[]
  }
  export let enumeration: string[]
  export let value: string = ''

  function getOptions() {
    const descs = annotation.itens
    return (enumeration as any[]).map((v, i) => {
      const text = descs ? v + ' - ' + descs[i] : v
      return { value: v, text }
    })
  }
</script>

<label title={annotation.aux}>
  {annotation.label + annotation.aux ? ' *' : ''}
  <select bind:value={value}>
    {#each getOptions() as opt}
      <option value={opt.value}>{opt.text}</option>
    {/each}
  </select>
</label>

