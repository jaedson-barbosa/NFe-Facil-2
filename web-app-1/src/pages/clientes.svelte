<script lang="ts">
  import { refEmpresa, permissaoEscrita, edicao } from '../code/store'
  import { goto, url } from '@roxi/routify'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { DocumentSnapshot } from 'firebase/firestore'
  import ExibDoc from '../nfe-parts/ExibDoc.svelte'

  const buscador = new Buscador($refEmpresa, Dados.Clientes, 'dest.xNome')
  $: cadastros = buscador.cadastros

  $edicao = undefined
  function editar(cad: DocumentSnapshot) {
    $edicao = {
      dado: cad.data(),
      id: cad.id,
      tipo: Dados.Clientes,
    }
    $goto('./cliente')
  }
</script>

<h1>Clientes</h1>
<label>
  Buscar cliente pelo nome
  <input bind:value={buscador.busca} />
</label>
{#if $permissaoEscrita}
  <a class="button" href={$url('./cliente')}>Adicionar</a>
{/if}

{#if cadastros.length}
  <table>
    <thead>
      <tr>
        <th>Documento</th>
        <th>Nome</th>
      </tr>
    </thead>
    <tbody>
      {#each cadastros as n}
        <tr class="clicavel" on:click={() => editar(n)}>
          <td>
            <ExibDoc
              CPF={n.get('dest.CPF')}
              CNPJ={n.get('dest.CNPJ')}
              idEstrangeiro={n.get('dest.idEstrangeiro')}
            />
          </td>
          <td>{n.get('dest.xNome')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if buscador.hasMore}
    <button on:click={buscador.carregarMais}>Carregar mais</button>
  {/if}
{/if}
