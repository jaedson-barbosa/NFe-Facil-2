<script>
  export let level = 3
  export let label
  export let aux = ''
</script>

<div class="container">
  {#if level == 1}
    <h1>{label}</h1>
  {:else if level == 2}
    <h2>{label}</h2>
  {:else if level == 3}
    <h3>{label}</h3>
  {:else if level == 4}
    <h4>{label}</h4>
  {:else if level == 5}
    <h5>{label}</h5>
  {:else}
    <h6>{label}</h6>
  {/if}
  <p>{aux}</p>
  <slot />
</div>
