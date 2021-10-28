<script lang="ts">
  import Adicionar from '../components/Adicionar.svelte'
  import { refEmpresa } from '../code/store'
  import { DocumentSnapshot } from 'firebase/firestore'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { mascararDocData, mascararDocSnapshot } from '../code/mascaracaoDoc'
  import { url } from '@roxi/routify'

  export let transporta: any

  let transportadores = [] as DocumentSnapshot[]
  const buscador = new Buscador(
    refEmpresa,
    Dados.Transportes,
    'transporta.xNome',
    'asc',
    (v) => (transportadores = v),
    true
  )
</script>

<h3>
  Transportador
  <Adicionar href={$url('./transporta')} />
</h3>
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
          class="clicavel destacado"
          on:click={() => (transporta = undefined)}
          title="Clique para remover transportador"
        >
          <td>{transporta.xNome}</td>
          <td>{mascararDocData(transporta)}</td>
        </tr>
      {/if}
      {#each transportadores as t}
        {#if transporta?.xNome != t.get('transporta.xNome')}
          <tr
            class="clicavel"
            on:click={() => (transporta = t.data().transporta)}
          >
            <td>{t.get('transporta.xNome')}</td>
            <td>{mascararDocSnapshot(t, 'transporta')}</td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
{/if}
