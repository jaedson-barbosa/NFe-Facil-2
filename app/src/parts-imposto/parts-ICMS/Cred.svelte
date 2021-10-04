<script lang="ts">
  export let ICMS: any
  export let opcional: boolean

  $: required = !opcional || ICMS['pCredSN'] || ICMS['vCredICMSSN']
</script>

<h4>Crédito do ICMS</h4>
<label>
  {#if required}
    Alíquota aplicável de cálculo do crédito
  {:else}
    <i>Alíquota aplicável de cálculo do crédito</i>
  {/if}
  <input type="number" step="0.0001" bind:value={ICMS['pCredSN']} {required} />
</label>
<label>
  {#if required}
    Valor do crédito que pode ser aproveitado
  {:else}
    <i>Valor do crédito que pode ser aproveitado</i>
  {/if}
  <small>Aproveitado nos termos do art. 23 da LC 123</small>
  <input
    type="number"
    step="0.0001"
    bind:value={ICMS['vCredICMSSN']}
    {required}
  />
</label>
<br />
