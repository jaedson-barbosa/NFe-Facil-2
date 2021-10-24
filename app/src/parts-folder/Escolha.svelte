<script lang="ts">
  import { liberacoes } from '../code/store'

  let cnpj = undefined
  $: {
    if (cnpj) {
      localStorage.setItem('idEmpresa', cnpj)
      location.reload()
    }
  }
</script>

{#if $liberacoes?.length}
  <label>
    Escolher empresa
    <select bind:value={cnpj}>
      {#each $liberacoes as liberacao}
        <option>{liberacao.cnpj}</option>
      {/each}
    </select>
  </label>
{/if}
