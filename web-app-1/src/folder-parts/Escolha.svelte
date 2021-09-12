<script lang="ts">
  import { idEmpresa, liberacoes } from '../code/store'
</script>

{#if $liberacoes?.length}
  <label>
    Escolher empresa
    <select bind:value={$idEmpresa}>
      {#each $liberacoes as liberacao}
        <option>{liberacao.cnpj}</option>
      {/each}
    </select>
  </label>
{/if}
