<script lang="ts">
  export let name: string
  export let raiz: any
  export let titulo: string

  let informar = !!raiz[name]

  $: {
    if (informar && !raiz[name]) raiz[name] = {}
    else if (!informar && raiz[name]) raiz[name] = undefined
  }
</script>

<label>
  <input type="checkbox" bind:checked={informar} />
  Informar campo {titulo}
</label>
{#if raiz[name]}
  <slot r={raiz[name]} />
{/if}
