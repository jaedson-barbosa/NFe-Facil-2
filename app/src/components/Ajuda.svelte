<hr />
<h2>Ajuda</h2>
<div class="col2">
  <slot />
</div>

<style>
  .col2 {
    text-align: justify
  }
  
  @media (min-width: 40rem) {
    .col2 {
      column-count: 2;
    }
  }
</style>
