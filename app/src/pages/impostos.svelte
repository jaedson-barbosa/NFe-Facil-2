<script lang="ts">
  import { edicao, IPerfilTributario, perfisTributarios } from '../code/store'
  import { goto } from '@roxi/routify'
  import { Dados } from '../code/tipos'
  import Voltar from '../components/Voltar.svelte'

  $edicao = undefined
  function editar({ id, descricao, imposto }: IPerfilTributario) {
    $edicao = { dado: { descricao, imposto }, id, tipo: Dados.Impostos }
    $goto('./imposto')
  }
</script>

<h1><Voltar /> Perfis tributários</h1>

{#if $perfisTributarios.length}
  <table>
    <thead><tr><th>Descrição</th></tr></thead>
    <tbody>
      {#each $perfisTributarios as n}
        <tr class="clicavel" on:click={() => editar(n)}>
          <td>{n.descricao}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
