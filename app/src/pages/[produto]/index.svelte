<script lang="ts">
  import { goto } from '@roxi/routify'
  import { params } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { atualizarImpostos } from '../../code/imposto/geral'
  import { edicao, perfisTributarios } from '../../code/store'
  import type { INFeRoot } from '../../code/tipos'
  import Imposto from '../../parts-imposto/Imposto.svelte'
  import ProdutoDetalhes from '../../parts-produto/ProdutoDetalhes.svelte'

  const { produto } = get(params)

  const ed = get(edicao)
  const raizNFe: INFeRoot = ed.dado.infNFe ?? ed.dado

  let regimeNormal = ['2', '3'].includes(raizNFe.emit.CRT)
  let consumidorFinal = raizNFe.ide.indFinal == '1'
  let raiz = raizNFe.det[+produto]

  let perfilTributario = raiz.perfilTributario
  $: {
    if (perfilTributario != raiz.perfilTributario) {
      const { imposto } = get(perfisTributarios).find(
        (v) => v.id === perfilTributario
      )
      raiz.imposto = imposto
      raiz.perfilTributario = perfilTributario
    }
    raiz.imposto = atualizarImpostos(
      raiz.prod,
      raiz.imposto,
      consumidorFinal,
      raiz.ibpt
    )
  }
</script>

<form on:submit|preventDefault={() => $goto('../nfe')}>
  <ProdutoDetalhes bind:raiz />
  <label>
    Perfil de tributação usado
    <select bind:value={perfilTributario} required>
      {#each $perfisTributarios as n}
        <option value={n.id}>{n.descricao}</option>
      {/each}
    </select>
  </label>
  {#key raiz.perfilTributario}
    <Imposto bind:imposto={raiz.imposto} {regimeNormal} />
  {/key}
  <input type="submit" value="Salvar" />
</form>
