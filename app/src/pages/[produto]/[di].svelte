<script lang="ts">
  import { goto, url } from '@roxi/routify'
  import { params } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao } from '../../code/store'
  import type { INFeRoot } from '../../code/tipos'
  import { Estados } from '../../code/IBGE'
  import { aplicarMascara } from '../../code/mascaracaoDoc'
  import { validaCNPJ } from '../../code/validacaoDoc'
  import Adicionar from '../../components/Adicionar.svelte'
  import { pattern } from '../../code/patterns'

  const { produto, di } = get(params)

  const ed = get(edicao)
  const raizNFe: INFeRoot = ed.dado.infNFe ?? ed.dado
  const isAdd = di == '-1'

  let raizProd = raizNFe.det[+produto]
  let raiz = isAdd ? {} : raizProd.DI[+di]

  if (!raiz.adi) raiz.adi = []

  function analisar(index: number) {
    return () => {
      const v = raiz.adi[index]
      if (v.nSeqAdic || v.cFabricante) return
      raiz.lacres.splice(index, 1)
      raiz.lacres = raiz.lacres
    }
  }

  function salvar() {
    if (isAdd) raizProd.DI.unshift(raiz)
    $goto('./')
  }
</script>

<form on:submit|preventDefault={salvar}>
  <h3>Declaração de Importação</h3>
  <label>
    Numero do Documento de Importação (DI/DSI/DA/DRI-E)
    <input maxlength="15" bind:value={raiz.nDI} required {pattern} />
  </label>
  <label>
    Data de registro da DI/DSI/DA
    <input type="date" bind:value={raiz.dDI} required />
  </label>
  <label>
    Local do desembaraço aduaneiro
    <input maxlength="60" bind:value={raiz.xLocDesemb} required {pattern} />
  </label>
  <label>
    UF onde ocorreu o desembaraço aduaneiro
    <select bind:value={raiz.UFDesemb} required>
      {#each Estados as uf}
        <option value={uf.Sigla}>{uf.Nome}</option>
      {/each}
    </select>
  </label>
  <label>
    Data do desembaraço aduaneiro
    <input type="date" bind:value={raiz.dDesemb} required />
  </label>
  <label>
    Via de transporte internacional informada na DI
    <select bind:value={raiz.tpViaTransp} required>
      <option value="1">Maritima</option>
      <option value="2">Fluvial</option>
      <option value="3">Lacustre</option>
      <option value="4">Aérea</option>
      <option value="5">Postal</option>
      <option value="6">Ferroviária</option>
      <option value="7">Rodoviária</option>
      <option value="8">Conduto/Rede transmissão</option>
      <option value="9">Meios próprios</option>
      <option value="10">Entrada ou saída ficta</option>
      <option value="11">Courier</option>
      <option value="12">Em mãoes</option>
      <option value="13">Por reboque</option>
    </select>
  </label>
  <label>
    <i>Valor Adicional ao frete para renovação de marinha mercante</i>
    <input type="number" step="0.01" bind:value={raiz.vAFRMM} />
  </label>
  <label>
    <select bind:value={raiz.tpIntermedio} required>
      <option value="1">Por conta própria</option>
      <option value="2">Por conta e ordem</option>
      <option value="3">Por encomenda</option>
    </select>
  </label>
  <label>
    <i>CNPJ do adquirente ou do encomendante</i>
    <input
      pattern={'[0-9]{14}'}
      bind:value={raiz.CNPJ}
      on:blur={() => validaCNPJ(raiz.CNPJ) || (raiz.CNPJ = '')}
      title={aplicarMascara(raiz.CNPJ, 'cnpj')}
    />
  </label>
  <label>
    UF do adquirente ou do encomendante
    <select bind:value={raiz.UFTerceiro}>
      {#each Estados as uf}
        <option value={uf.Sigla}>{uf.Nome}</option>
      {/each}
    </select>
  </label>
  <label>
    Código do exportador
    <input maxlength="60" bind:value={raiz.cExportador} required {pattern} />
  </label>
  <h4>
    Adições ou itens
    <Adicionar on:click={() => (raiz.adi = [{}, ...raiz.adi])} />
  </h4>
  {#if raiz.adi}
    <table>
      <thead>
        <tr>
          <th>Nº sequencial do item</th>
          <th>Cód. fabricante estrangeiro</th>
          <th><i>Nº da adição</i></th>
          <th><i>Valor descondo do item</i></th>
          <th><i>Nº ato concessório de Drawback</i></th>
        </tr>
      </thead>
      <tbody>
        {#each raiz.adi as v, i}
          <tr>
            <td>
              <input
                type="number"
                bind:value={raiz.adi[i].nSeqAdic}
                on:blur={analisar(i)}
                required
              />
            </td>
            <td>
              <input
                bind:value={raiz.adi[i].cFabricante}
                on:blur={analisar(i)}
                minlength="1"
                maxlength="60"
                required
                {pattern}
              />
            </td>
            <td>
              <input
                bind:value={raiz.adi[i].nAdicao}
                pattern={'[1-9]{1}[0-9]{0,2}'}
              />
            </td>
            <td>
              <input
                type="number"
                step="0.01"
                min="0"
                bind:value={raiz.adi[i].vDescDI}
              />
            </td>
            <td>
              <input bind:value={raiz.adi[i].nDraw} pattern={'[0-9]{0,11}'} />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}

  <a class="button" href={$url('./')}>Cancelar</a>
  <input type="submit" class="button" value="Salvar" />
</form>
