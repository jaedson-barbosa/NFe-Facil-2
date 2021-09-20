<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao, refEmpresa, empresa } from '../code/store'
  import { Dados, INFeRoot } from '../code/tipos'
  import Det from '../nfe-parts/Det.svelte'

  export let produto: string

  const ed = get(edicao)
  const raiz: INFeRoot = ed?.tipo == Dados.NFes ? { ...ed.dado } : {}
</script>

<form on:submit|preventDefault={() => $goto('./nfe')}>
  <Det
    raiz={raiz.det[+produto]}
    regimeNormal={raiz.emit.CRT == '3'}
    consumidorFinal={raiz.ide.indFinal == '1'}
  />
  <input type="submit" value="Salvar" />
</form>
