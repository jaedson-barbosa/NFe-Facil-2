<script lang="ts">
  import { refEmpresa, permissaoEscrita, edicao } from '../code/store'
  import { goto, url } from '@roxi/routify'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { DocumentSnapshot } from 'firebase/firestore'
  import Voltar from '../components/Voltar.svelte'

  let cadastros: DocumentSnapshot[] = []
  const buscador = new Buscador(
    $refEmpresa,
    Dados.NFes,
    'infNFe.ide.nNF',
    'desc',
    (v) => (cadastros = v)
  )

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

<h1><Voltar /> Notas fiscais</h1>
{#if $permissaoEscrita}
  <a class="button" href={$url('./nfe')}>Adicionar</a>
  <a class="button" href={$url('./importacao')}>Importar</a>
  <hr />
{/if}
<label>
  Buscar nota fiscal pelo número
  <input on:input={buscador.buscar} />
</label>

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
          class:homologacao={n.get('infNFe.ide.tpAmb') == '2'}
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
    color: hsl(240, 100%, 50%);
  }

  .cancelado {
    color: hsl(0, 100%, 50%);
  }

  .cancelado.homologacao {
    color: hsl(300, 100%, 50%);
  }
</style>
