<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao } from '../code/store'
  import { Dados, INFeRoot } from '../code/tipos'
  import Imposto from '../nfe-parts/Imposto.svelte'
  import ProdutoDetalhes from '../nfe-parts/ProdutoDetalhes.svelte'

  export let produto: string

  const ed = get(edicao)
  const raizNFe: INFeRoot = ed?.tipo == Dados.NFes ? { ...ed.dado } : {}

  let regimeNormal = raizNFe.emit.CRT == '3'
  let consumidorFinal = raizNFe.ide.indFinal == '1'
  let raiz = raizNFe.det[+produto]
</script>

<form on:submit|preventDefault={() => $goto('./nfe')}>
  <ProdutoDetalhes bind:raiz />
  <Imposto bind:raiz {regimeNormal} {consumidorFinal} />
  <input type="submit" value="Salvar" />
</form>
