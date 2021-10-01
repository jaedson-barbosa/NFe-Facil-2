<script lang="ts">
  export let raiz: any

  if (!raiz.infAdic) raiz.infAdic = {}
</script>

<h2>Informações adicionais</h2>
<div class="row">
  <div class="column">
    <label>
      <i>Informações de interesse do contribuinte</i>
      <input maxlength="5000" bind:value={raiz.infAdic['infCpl']} />
    </label>
  </div>
  <div class="column">
    <label>
      <i>Informações de interesse do fisco</i>
      <input maxlength="2000" bind:value={raiz.infAdic['infAdFisco']} />
    </label>
  </div>
</div>
<br />
