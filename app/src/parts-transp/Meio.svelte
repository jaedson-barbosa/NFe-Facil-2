<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import { refEmpresa } from '../code/store'
  import { DocumentSnapshot } from 'firebase/firestore'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'

  export let transp: any

  if (!transp.reboque) transp.reboque = []

  let veiculos = [] as DocumentSnapshot[]
  const buscador = new Buscador(
    $refEmpresa,
    Dados.Veiculos,
    'placa',
    'asc',
    (v) => (veiculos = v)
  )

  function adicionar(n: DocumentSnapshot) {
    return () => {
      const veiculo = n.data()
      if (transp.veicTransp) {
        transp.reboque = [veiculo, ...transp.reboque]
      } else {
        transp.veicTransp = veiculo
      }
    }
  }

  function remover(index: number) {
    return () => {
      transp.reboque.splice(index, 1)
      transp.reboque = transp.reboque
    }
  }

  const meios = ['vagao', 'balsa', 'veicTransp']
  let meio = meios.find((v) => transp[v]) ?? 'nenhum'
  $: {
    if (meio != 'vagao') delete transp.vagao
    if (meio != 'balsa') delete transp.balsa
    if (meio != 'veicTransp') {
      delete transp.veicTransp
      transp.reboque = []
    }
  }

  $: veicTransp = transp.veicTransp
  $: avisoAdd = veicTransp ? 'Adicionar reboque' : 'Definir veículo trator'
  $: reboque = transp.reboque as any[]
</script>

<h3>Meio</h3>
<label>
  Meio
  <select bind:value={meio}>
    <option value="nenhum">Sem informação</option>
    <option value="vagao">Vagão</option>
    <option value="balsa">Balsa</option>
    <option value="veicTransp">Veículo</option>
  </select>
</label>
{#if meio == 'vagao'}
  <InputT bind:val={transp.vagao} lab="Vagão" min={1} max={20} />
{:else if meio == 'balsa'}
  <InputT bind:val={transp.balsa} lab="Balsa" min={1} max={20} />
{:else if meio == 'veicTransp'}
  <label>
    Buscar veículo pela placa
    <input on:input={buscador.buscar} />
  </label>
  {#if veiculos.length}
    <table>
      <thead>
        <tr>
          <th>Placa</th>
          <th>Estado</th>
          <th><i>RNTC</i></th>
        </tr>
      </thead>
      <tbody>
        {#each veiculos as n}
          <tr class="clicavel" on:click={adicionar(n)} title={avisoAdd}>
            <td>{n.get('placa')}</td>
            <td>{n.get('UF')}</td>
            <td>{n.get('RNTC')}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  {#if veicTransp}
    <h4>Veículo trator</h4>
    <p>
      Placa:
      <i>{veicTransp['placa']}</i>
      <br />
      Estado:
      <i>{veicTransp['UF']}</i>
      {#if veicTransp['RNTC']}
        <br />
        RNTC:
        <i>{veicTransp['RNTC']}</i>
      {/if}
    </p>
    <button type="button" on:click={() => delete transp.veicTransp}>
      Trocar
    </button>
    <br />
  {/if}
  {#if reboque.length}
    <h4>Reboques</h4>
    <table>
      <thead>
        <tr>
          <th>Placa</th>
          <th>Estado</th>
          <th><i>RNTC</i></th>
        </tr>
      </thead>
      <tbody>
        {#each reboque as v, i}
          <tr
            class="clicavel"
            on:click={remover(i)}
            title="Clique para remover reboque"
          >
            <td>{v.placa}</td>
            <td>{v.UF}</td>
            <td>{v.RNTC}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/if}
<br />
