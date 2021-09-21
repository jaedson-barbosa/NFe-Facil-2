<script lang="ts">
  import { goto, url } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao } from '../../code/store'
  import { Dados, INFeRoot } from '../../code/tipos'
  import InputT from '../../components/InputT.svelte'

  export let index: string

  const ed = get(edicao)
  const raizNFe: INFeRoot = ed?.tipo == Dados.NFes ? { ...ed.dado } : {}
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
  <InputT
    bind:val={raiz.qVol}
    opt
    lab="Quantidade de volumes transportados"
    pat={'[0-9]{1,15}'}
  />
  <InputT
    bind:val={raiz.esp}
    opt
    lab="Espécie dos volumes transportados"
    min={1}
    max={60}
  />
  <InputT
    bind:val={raiz.marca}
    opt
    lab="Marca dos volumes transportados"
    min={1}
    max={60}
  />
  <InputT
    bind:val={raiz.nVol}
    opt
    lab="Numeração dos volumes transportados"
    min={1}
    max={60}
  />
  <InputT
    bind:val={raiz.pesoL}
    opt
    lab="Peso líquido (em kg)"
    pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
  />
  <InputT
    bind:val={raiz.pesoB}
    opt
    lab="Peso bruto (em kg)"
    pat={'0|0.[0-9]{3}|[1-9]{1}[0-9]{0,11}(.[0-9]{3})?'}
  />

  <h4>Lacres</h4>
  <button type="button" on:click={() => (raiz.lacres = [{}, ...raiz.lacres])}>
    Adicionar
  </button>
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
