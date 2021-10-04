<script lang="ts">
  import { edicao, refEmpresa } from '../code/store'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { DocumentSnapshot } from 'firebase/firestore'
  import Voltar from '../components/Voltar.svelte'
  import { goto } from '@roxi/routify'

  let cadastros: DocumentSnapshot[] = []
  const buscador = new Buscador(
    $refEmpresa,
    Dados.Veiculos,
    'placa',
    'asc',
    (v) => (cadastros = v),
    false
  )

  $edicao = undefined
  function editar(cad: DocumentSnapshot) {
    $edicao = {
      dado: cad.data(),
      id: cad.id,
      tipo: Dados.Veiculos,
    }
    $goto('./veiculo')
  }
</script>

<h1><Voltar /> Veículos</h1>
<label>
  Buscar veículo pela placa
  <input on:input={buscador.buscar} />
</label>

{#if cadastros.length}
  <table>
    <thead>
      <tr>
        <th>Placa</th>
        <th>Estado</th>
        <th><i>RNTC</i></th>
      </tr>
    </thead>
    <tbody>
      {#each cadastros as n}
        <tr class="clicavel" on:click={() => editar(n)}>
          <td>{n.get('placa')}</td>
          <td>{n.get('UF')}</td>
          <td>{n.get('RNTC') ?? ''}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if buscador.hasMore}
    <button on:click={buscador.carregarMais}>Carregar mais</button>
  {/if}
{/if}
