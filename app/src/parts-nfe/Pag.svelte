<script lang="ts">
  import { getMoeda } from '../code/numero'
  import Adicionar from '../components/Adicionar.svelte'

  export let raiz: any
  export let total: number

  if (!raiz['pag']) raiz['pag'] = {}
  let pag = raiz['pag']
  if (!pag.detPag) pag.detPag = []

  $: {
    const detPag = pag.detPag as any[]
    const vTroco = detPag.reduce((p, c) => p + c.vPag ?? 0, 0) - total
    pag['vTroco'] = vTroco <= 0 ? '' : vTroco
    detPag.forEach((v) => {
      v.card = v.tPag == '03' || v.tPag == '04' ? { tpIntegra: '2' } : undefined
    })
  }

  function analisar(index: number) {
    return () => {
      if (pag.detPag[index].vPag) return
      pag.detPag.splice(index, 1)
      pag.detPag = pag.detPag
    }
  }
</script>

<h2>
  Pagamento
  <Adicionar on:click={() => (pag.detPag = [{}, ...pag.detPag])} />
</h2>
{#if pag.detPag.length}
  <table>
    <thead>
      <tr>
        <th>Indicador</th>
        <th>Forma</th>
        <th>Valor</th>
      </tr>
    </thead>
    <tbody>
      {#each pag.detPag as _, i}
        <tr>
          <td>
            <select bind:value={pag.detPag[i].indPag} required>
              <option value="0">À vista</option>
              <option value="1">À Prazo</option>
            </select>
          </td>
          <td>
            <select bind:value={pag.detPag[i].tPag} required>
              <option value="01">Dinheiro</option>
              <option value="02">Cheque</option>
              <option value="03">Cartão de crédito</option>
              <option value="04">Cartão de débito</option>
              <option value="05">Crédito Loja</option>
              <option value="10">Vale Alimentação</option>
              <option value="11">Vale Refeição</option>
              <option value="12">Vale Presente</option>
              <option value="13">Vale Combustível</option>
              <option value="14">Duplicata Mercantil</option>
              <option value="15">Boleto Bancario</option>
              <option value="16">Depósito Bancário</option>
              <option value="17">Pagamento Instantâneo (PIX)</option>
              <option value="18">
                Transferência bancária, Carteira Digital
              </option>
              <option value="19">
                Programa de fidelidade, Cashback, Crédito Virtual
              </option>
              {#if !pag.detPag[i].vPag}
                <option value="90">Sem Pagamento</option>
              {/if}
            </select>
          </td>
          <td>
            {#if pag.detPag[i].tPag != 90}
              <input
                type="number"
                step="0.01"
                bind:value={pag.detPag[i].vPag}
                on:blur={analisar(i)}
                required
              />
            {:else}
              Sem valor
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
{#if pag['vTroco']}
  <p>
    Valor do troco: <em>{getMoeda(pag['vTroco'])}</em>
  </p>
{/if}
<br />
