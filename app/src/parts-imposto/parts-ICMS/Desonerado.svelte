<script lang="ts">
  import { getMotDes } from '../../code/imposto/ICMS'

  export let ICMS: any
  export let tipoICMS: string

  $: {
    if (!ICMS['vICMSDeson'] && ICMS['motDesICMS']) ICMS['motDesICMS'] = ''
  }
</script>

<h4>ICMS desonerado</h4>
<label>
  <i>Valor do ICMS desonerado</i>
  <input type="number" step="0.01" bind:value={ICMS['vICMSDeson']} />
</label>
{#if ICMS['vICMSDeson']}
  <label>
    Motivo da desoneração
    <select bind:value={ICMS['motDesICMS']} required>
      {#each getMotDes(tipoICMS) as e}
        <option value={e[0]}>{e[0]} - {e[1]}</option>
      {/each}
    </select>
  </label>
{/if}
<br />
