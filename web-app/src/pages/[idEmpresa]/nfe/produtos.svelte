<script lang="ts">
  import { url } from '@roxi/routify'
  import type INFeRoot from './INFeRoot'

  export let scoped: INFeRoot

  $: elements = scoped.det.map((v, i) => {
    v.nItem = (i + 1).toString()
    return v
  })

  $: isNFCe = scoped.ide.mod == 65
</script>

<div class="container">
  {#if !scoped.dest}
    <a href={$url('./identificacao')} class="button">
      Voltar: Identificação
    </a>
  {:else}
    <a href={$url('./cliente')} class="button"> Voltar: Cliente </a>
  {/if}
  {#if elements.length}
    <a class="button" href={$url('./produto')}> Adicionar produto </a>
    <a class="button" href={$url('./total')}> Próximo: Totais </a>
  {:else}
    <a class="button" href={$url('./produto')}> Adicionar produto </a>
  {/if}
  <table class="table is-hoverable is-fullwidth">
    <tr>
      <th>Código</th>
      <th>Descrição</th>
      <th>Ações</th>
    </tr>
    {#each elements as cad, i}
      <tr>
        <td>{cad.prod.cProd}</td>
        <td>{cad.prod.xProd}</td>
        <td>
          <a href={$url('./produto/:edit', { edit: i })}> Editar </a>
        </td>
      </tr>
    {/each}
  </table>
</div>
