<script lang="ts">
  import { refEmpresa, permissaoEscrita, edicao } from '../code/store'
  import { goto, url } from '@roxi/routify'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { DocumentSnapshot } from 'firebase/firestore'

  const buscador = new Buscador($refEmpresa, Dados.NFes, 'infNFe.ide.nNF')
  $: cadastros = buscador.cadastros

  $edicao = undefined
  function exibir(cad: DocumentSnapshot) {
    $edicao = {
      dado: cad.data(),
      id: cad.id,
      tipo: Dados.NFes,
    }
    $goto('./nfeExib')
  }
</script>

<h1>Notas fiscais</h1>
<label>
  Buscar nota fiscal pelo número
  <input bind:value={buscador.busca} />
</label>
{#if $permissaoEscrita}
  <a class="button" href={$url('./nfe')}>Adicionar</a>
{/if}

{#if cadastros.length}
  <table>
    <thead>
      <tr>
        <th>Número</th>
        <th>Data e hora</th>
        <th>Destinatário</th>
      </tr>
    </thead>
    <tbody>
      {#each cadastros as n}
        <tr
          class="clicavel"
          class:homologacao={n.get('infNFe.ide.tpAmb') == '1'}
          class:cancelado={n.get('cancelada')}
          on:click={() => exibir(n)}
        >
          <td>{n.get('infNFe.ide.nNF')}</td>
          <td>{n.get('dhEmi').toDate().toLocaleString()}</td>
          <td>{n.get('infNFe.dest.xNome')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if buscador.hasMore}
    <button on:click={buscador.carregarMais}>Carregar mais</button>
  {/if}
{/if}

<style>
  .homologacao {
    background-color: #8888e1;
  }

  .cancelado {
    background-color: #e18888;
  }

  .cancelado.homologacao {
    background-color: #e188e1;
  }
</style>
