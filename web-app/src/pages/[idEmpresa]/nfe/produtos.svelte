<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import type INFeRoot from './INFeRoot'

  export let scoped: { commom: { root: INFeRoot } }
  $: elements = scoped.commom.root.det.map((v,i) => {
    v.nItem = (i + 1).toString()
    return v
  })

  function submit() {
    if (elements.length) {
      $goto('./total')
    } else {
      $goto('./produto')
    }
  }
</script>

<div class="container content box">
  <form on:submit|preventDefault={submit}>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('./cliente')} class="button is-danger">
          Voltar: Cliente
        </a>
      </p>
      {#if elements.length}
        <p class="control">
          <a href={$url('./produto')} class="button"> Adicionar produto </a>
        </p>
      {/if}
      <p class="control">
        <button class="button is-primary">
          {#if elements.length}
            Próximo: Totais
          {:else}
            Adicionar produto
          {/if}
        </button>
      </p>
    </div>
  </form>
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
