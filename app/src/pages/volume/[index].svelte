<script lang="ts">
  import { goto, url } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao } from '../../code/store'
  import type { INFeRoot } from '../../code/tipos'
  import Adicionar from '../../components/Adicionar.svelte'

  export let index: string

  const ed = get(edicao)
  const raizNFe: INFeRoot = ed.dado.infNFe ?? ed.dado
  const isAdd = index == '-1'
  let raiz = isAdd ? {} : raizNFe.transp.vol[+index]

  if (!raiz.lacres) raiz.lacres = []

  function analisar(index: number) {
    return () => {
      if (raiz.lacres[index].nLacre) return
      raiz.lacres.splice(index, 1)
      raiz.lacres = raiz.lacres
    }
  }

  function salvar() {
    if (isAdd) raizNFe.transp.vol.unshift(raiz)
    $goto('../nfe')
  }
</script>

<form on:submit|preventDefault={salvar}>
  <h3>Detalhamento de volume</h3>
  <label>
    <i>Quantidade de volumes transportados</i>
    <input type="number" step="1" bind:value={raiz.qVol} />
  </label>
  <label>
    <i>Espécie dos volumes transportados</i>
    <input maxlength="60" bind:value={raiz.esp} />
  </label>
  <label>
    <i>Marca dos volumes transportados</i>
    <input maxlength="60" bind:value={raiz.marca} />
  </label>
  <label>
    <i>Numeração dos volumes transportados</i>
    <input maxlength="60" bind:value={raiz.nVol} />
  </label>
  <label>
    <i>Peso líquido (em kg)</i>
    <input type="number" step="0.001" bind:value={raiz.pesoL} />
  </label>
  <label>
    <i>Peso bruto (em kg)</i>
    <input type="number" step="0.001" bind:value={raiz.pesoB} />
  </label>
  <h4>
    Lacres
    <Adicionar on:click={() => (raiz.lacres = [{}, ...raiz.lacres])} />
  </h4>
  <br />
  {#if raiz.lacres.length}
    <table>
      <thead>
        <tr>
          <th>Número do lacre</th>
        </tr>
      </thead>
      <tbody>
        {#each raiz.lacres as _, i}
          <tr>
            <td>
              <input
                bind:value={raiz.lacres[i].nLacre}
                on:blur={analisar(i)}
                min="1"
                max="60"
                required
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  <br />

  <a class="button" href={$url('../nfe')}>Cancelar</a>
  <input type="submit" class="button" value="Salvar" />
</form>
