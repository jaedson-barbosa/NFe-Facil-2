<script lang="ts">
  import { refEmpresa } from '../code/store'
  import { DocumentSnapshot } from 'firebase/firestore'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { mascararDocData, mascararDocSnapshot } from '../code/mascaracaoDoc'

  export let transporta: any

  let transportadores = [] as DocumentSnapshot[]
  const buscador = new Buscador(
    $refEmpresa,
    Dados.Transportes,
    'transporta.xNome',
    'asc',
    (v) => (transportadores = v)
  )
</script>

<h3>Transportador</h3>
<label>
  Buscar transportador pelo nome
  <input on:input={buscador.buscar} />
</label>
{#if transportadores.length}
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Documento</th>
      </tr>
    </thead>
    <tbody>
      {#if transporta}
        <tr
          class="clicavel marcado"
          on:click={() => (transporta = undefined)}
          title="Clique para remover transportador"
        >
          <td>{transporta.xNome}</td>
          <td>{mascararDocData(transporta)}</td>
        </tr>
      {/if}
      {#each transportadores as t}
        <tr class="clicavel" on:click={() => (transporta = t.data())}>
          <td>{t.get('transporta.xNome')}</td>
          <td>{mascararDocSnapshot(t, 'transporta')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
