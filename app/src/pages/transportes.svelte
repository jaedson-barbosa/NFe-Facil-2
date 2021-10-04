<script lang="ts">
  import { refEmpresa, edicao } from '../code/store'
  import { goto } from '@roxi/routify'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { DocumentSnapshot } from 'firebase/firestore'
  import Voltar from '../components/Voltar.svelte'
  import { mascararDocSnapshot } from '../code/mascaracaoDoc'

  let cadastros: DocumentSnapshot[] = []
  const buscador = new Buscador(
    $refEmpresa,
    Dados.Transportes,
    'transporta.xNome',
    'asc',
    (v) => (cadastros = v),
    false
  )

  $edicao = undefined
  function editar(cad: DocumentSnapshot) {
    $edicao = {
      dado: cad.data(),
      id: cad.id,
      tipo: Dados.Transportes,
    }
    $goto('./transporta')
  }
</script>

<h1><Voltar /> Transportadores</h1>
<label>
  Buscar transportador pelo nome
  <input on:input={buscador.buscar} />
</label>

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
          <td>{mascararDocSnapshot(n, 'transporta')}</td>
          <td>{n.get('transporta.xNome')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if buscador.hasMore}
    <button on:click={buscador.carregarMais}>Carregar mais</button>
  {/if}
{/if}
