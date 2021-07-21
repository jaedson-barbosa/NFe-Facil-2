<script lang="ts">
  export let name: string
  export let raiz: any

  let informar = !!raiz[name]

  $: {
    if (informar && !raiz[name]) raiz[name] = {}
    else if (!informar && raiz[name]) raiz[name] = undefined
  }
</script>

<label>
  Informar campo opcional
  <input type="checkbox" bind:checked={informar} />
</label>
{#if raiz[name]}
  <slot />
{/if}
