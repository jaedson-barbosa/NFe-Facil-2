<script lang="ts">
  import { goto } from '@roxi/routify'
  import { params } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao } from '../../code/store'
  import { Dados, INFeRoot } from '../../code/tipos'
  import Imposto from '../../parts-nfe/Imposto.svelte'
  import ProdutoDetalhes from '../../parts-nfe/ProdutoDetalhes.svelte'

  const { produto } = get(params)

  const ed = get(edicao)
  const raizNFe: INFeRoot = ed?.tipo == Dados.NFes ? { ...ed.dado } : {}

  let regimeNormal = raizNFe.emit.CRT == '3'
  let consumidorFinal = raizNFe.ide.indFinal == '1'
  let raiz = raizNFe.det[+produto]
</script>

<form on:submit|preventDefault={() => $goto('../nfe')}>
  <ProdutoDetalhes bind:raiz />
  <Imposto bind:raiz {regimeNormal} {consumidorFinal} />
  <input type="submit" value="Salvar" />
</form>
