<script>
  export let level = 3
  export let label
  export let aux
</script>

<div class="container content box">
  <div class="field is-horizontal">
    <div class="field-label" />
    <div class="field-body">
      <div class="field">
        <h1 class="title is-{level}">{label}</h1>
        {#if aux}
          <h1 class="subtitle is-{level + 2}">{aux}</h1>
        {/if}
      </div>
    </div>
  </div>
  <slot />
</div>
