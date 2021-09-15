<script lang="ts">
  import { refEmpresa, permissaoEscrita, edicao } from '../code/store'
  import { goto, url } from '@roxi/routify'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { DocumentSnapshot } from 'firebase/firestore'

  let cadastros: DocumentSnapshot[] = []
  const buscador = new Buscador(
    $refEmpresa,
    Dados.Produtos,
    'det.prod.xProd',
    'asc',
    (v) => (cadastros = v)
  )

  $edicao = undefined
  function editar(cad: DocumentSnapshot) {
    $edicao = {
      dado: cad.data(),
      id: cad.id,
      tipo: Dados.Produtos,
    }
    $goto('./produto')
  }
</script>

<h1>Produtos</h1>
<label>
  Buscar produto pela descrição
  <input on:input={buscador.buscar} />
</label>
{#if $permissaoEscrita}
  <a class="button" href={$url('./produto')}>Adicionar</a>
{/if}

{#if cadastros.length}
  <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      {#each cadastros as n}
        <tr class="clicavel" on:click={() => editar(n)}>
          <td>{n.get('det.prod.cProd')}</td>
          <td>{n.get('det.prod.xProd')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if buscador.hasMore}
    <button on:click={buscador.carregarMais}>Carregar mais</button>
  {/if}
{/if}
