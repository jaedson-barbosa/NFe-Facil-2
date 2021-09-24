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
{#if transporta}
  <p>
    Transportador escolhido:
    <br />
    Nome:
    <i>transporta.xNome</i>
    <br />
    Documento:
    <i>{mascararDocData(transporta)}</i>
  </p>
{:else}
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
        {#each transportadores as t}
          <tr
            class="clicavel"
            class:marcado={transporta?.xNome == t.get('transporta.xNome')}
            on:click={() => (transporta = t.data())}
          >
            <td>{t.get('transporta.xNome')}</td>
            <td>{mascararDocSnapshot(t, 'transporta')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/if}
