<script lang="ts">
  import { goto, url } from '@roxi/routify'
  import { params } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao } from '../../code/store'
  import { Dados, INFeRoot } from '../../code/tipos'
  import { Estados } from '../../code/IBGE'
  import { aplicarMascara } from '../../code/mascaracaoDoc'
  import { validaCNPJ } from '../../code/validacaoDoc'

  const { produto, di } = get(params)

  const ed = get(edicao)
  const raizNFe: INFeRoot = ed?.tipo == Dados.NFes ? { ...ed.dado } : {}
  const isAdd = di == '-1'

  let raizProd = raizNFe.det[+produto]
  let raiz = isAdd ? {} : raizProd.DI[+di]

  if (!raiz.adi) raiz.adi = []

  function analisar(index: number) {
    return () => {
      const v = raiz.adi[index]
      if (v.nAdicao || v.nSeqAdic || v.cFabricante) return
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
    <input maxlength="12" bind:value={raiz.nDI} required />
  </label>
  <label>
    Data de registro da DI/DSI/DA
    <input type="date" bind:value={raiz.dDI} required />
  </label>
  <label>
    Local do desembaraço aduaneiro
    <input maxlength="60" bind:value={raiz.xLocDesemb} required />
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
      <option value="8">Conduto</option>
      <option value="9">Meios próprios</option>
      <option value="10">Entrada ou saída ficta</option>
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
    <small>{aplicarMascara(raiz.CNPJ, 'cnpj')}</small>
    <input
      pattern="[0-9]{14}"
      bind:value={raiz.CNPJ}
      on:blur={() => validaCNPJ(raiz.CNPJ) || (raiz.CNPJ = '')}
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
    <input maxlength="60" bind:value={raiz.cExportador} required />
  </label>
  <h4>Adições</h4>
  <button type="button" on:click={() => (raiz.adi = [{}, ...raiz.adi])}>
    Adicionar
  </button>
  {#if raiz.adi}
    <table>
      <thead>
        <tr>
          <th>Nº da adição</th>
          <th>Nº do item na adição</th>
          <th>Cód. fabricante estrangeiro</th>
          <th><i>Valor descondo do item da DI</i></th>
          <th><i>Nº ato concessório</i></th>
        </tr>
      </thead>
      <tbody>
        {#each raiz.adi as _, i}
          <tr>
            <td>
              <input
                bind:value={raiz.adi[i].nAdicao}
                on:blur={analisar(i)}
                pattern={'[1-9]{1}[0-9]{0,2}'}
                required
              />
            </td>
            <td>
              <input
                bind:value={raiz.adi[i].nSeqAdic}
                on:blur={analisar(i)}
                pattern={'[1-9]{1}[0-9]{0,2}'}
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
