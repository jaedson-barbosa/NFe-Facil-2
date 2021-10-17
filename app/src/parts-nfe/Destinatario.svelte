<script lang="ts">
  import Doc from '../components/Doc.svelte'
  import Adicionar from '../components/Adicionar.svelte'
  import { DocumentSnapshot } from 'firebase/firestore'
  import { refEmpresa } from '../code/store'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { mascararDocData, mascararDocSnapshot } from '../code/mascaracaoDoc'
  import { url } from '@roxi/routify'

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
    (v) => (clientes = v),
    true
  )
</script>

<!-- Botar de uma forma que caso digitado o documento corretamente no campo de busca, caso ele não seja encontrado então será usado apenas o documento caso seja uma NFC-e -->
<h2>
  Destinatário
  <Adicionar href={$url('./cliente')} />
</h2>
{#if isNFCe && destSemNome}
  <p>Numa NFC-e, caso queiras, podes informar apenas o documento do cliente.</p>
  <Doc bind:raiz={dest} />
{/if}
{#if !(destComDoc && destSemNome)}
  <div class="row">
    <div class="column">
      <label>
        Campo de busca
        <select bind:value={buscadorCliente.campoPrincipal}>
          <option value="dest.xNome">Nome</option>
          <option value="dest.CPF">CPF</option>
          <option value="dest.CNPJ">CNPJ</option>
          <option value="dest.idEstrangeiro">Identificação estrangeira</option>
        </select>
      </label>
    </div>
    <div class="column">
      <label>
        Buscar usando o campo selecionado
        <input on:input={buscadorCliente.buscar} />
      </label>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Documento</th>
        <th>Nome</th>
      </tr>
    </thead>
    <tbody>
      {#if dest.xNome}
        <tr
          class="marcado clicavel"
          on:click={() => (dest = {})}
          title="Trocar cliente"
        >
          <td>{mascararDocData(dest)}</td>
          <td>{dest.xNome}</td>
        </tr>
      {/if}
      {#each clientes as c}
        {#if dest?.xNome != c.get('dest.xNome')}
          <tr class="clicavel" on:click={() => (dest = c.data().dest)}>
            <td>{mascararDocSnapshot(c, 'dest')}</td>
            <td>{c.get('dest.xNome')}</td>
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
{/if}
<br />
