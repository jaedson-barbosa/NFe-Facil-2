<script lang="ts">
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

  function removerReboque(index: number) {
    return () => {
      transp.reboque.splice(index, 1)
      transp.reboque = transp.reboque
    }
  }

  function removerVeicTransp() {
    delete transp.veicTransp
    transp.reboque = []
    transp = transp
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
  <label>
    Identificação do vagão
    <input maxlength="20" bind:value={transp.vagao} required />
  </label>
{:else if meio == 'balsa'}
  <label>
    Identificação da balsa
    <input maxlength="20" bind:value={transp.balsa} required />
  </label>
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
        {#if veicTransp}
          <tr
            class="clicavel marcado"
            on:click={removerVeicTransp}
            title="Clique para remover identificação de veículo trator"
          >
            <td>{veicTransp['placa']}</td>
            <td>{veicTransp['UF']}</td>
            <td>{veicTransp['RNTC'] ?? ''}</td>
          </tr>
        {/if}
        {#each reboque as v, i}
          <tr
            class="clicavel marcado"
            on:click={removerReboque(i)}
            title="Clique para remover reboque"
          >
            <td>{v.placa}</td>
            <td>{v.UF}</td>
            <td>{v.RNTC ?? ''}</td>
          </tr>
        {/each}
        {#each veiculos as n}
          <tr class="clicavel" on:click={adicionar(n)} title={avisoAdd}>
            <td>{n.get('placa')}</td>
            <td>{n.get('UF')}</td>
            <td>{n.get('RNTC') ?? ''}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
{/if}
<br />
