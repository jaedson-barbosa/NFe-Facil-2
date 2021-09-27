<script lang="ts">
  import Doc from '../components/Doc.svelte'
  import { DocumentSnapshot } from 'firebase/firestore'
  import { refEmpresa } from '../code/store'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { mascararDocData, mascararDocSnapshot } from '../code/mascaracaoDoc'

  export let dest: any
  export let isNFCe: boolean

  if (!dest) dest = {}

  $: destComDoc = dest?.CPF || dest?.CNPJ || dest?.idEstrangeiro
  $: destSemNome = !dest?.xNome

  let clientes = [] as DocumentSnapshot[]
  const buscadorCliente = new Buscador(
    $refEmpresa,
    Dados.Clientes,
    'dest.xNome',
    'asc',
    (v) => (clientes = v)
  )
</script>

<h2>Destinatário</h2>
{#if isNFCe && destSemNome}
  <p>Numa NFC-e é possível informar apenas o documento do cliente.</p>
  <Doc bind:raiz={dest} />
{/if}
{#if destComDoc && !isNFCe}
  <p>
    Cliente escolhido: <br />
    Nome:
    <em>{dest.xNome}</em>
    <br />
    Documento:
    <em>{mascararDocData(dest)}</em>
  </p>
  <button type="button" on:click={() => (dest = {})}>Trocar</button>
  <br />
{/if}
{#if !destComDoc}
  {#if isNFCe}
    <p>Como também é possível informar todos os dados do cliente.</p>
  {/if}
  <label>
    Buscar por nome
    <input on:input={buscadorCliente.buscar} />
  </label>
  <table>
    <thead>
      <tr>
        <th>Documento</th>
        <th>Nome</th>
      </tr>
    </thead>
    <tbody>
      {#each clientes as c}
        <tr class="clicavel" on:click={() => (dest = c.data().dest)}>
          <td>{mascararDocSnapshot(c, 'dest')}</td>
          <td>{c.get('dest.xNome')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<br />
