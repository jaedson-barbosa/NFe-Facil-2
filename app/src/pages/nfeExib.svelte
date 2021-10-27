<script lang="ts">
  import { edicao } from '../code/store'
  import { goto } from '@roxi/routify'
  import { Dados } from '../code/tipos'
  import { get } from 'svelte/store'
  import Voltar from '../components/Voltar.svelte'
  import NFe from '../parts-nfe-exib/NFe.svelte'
  import NFCe from '../parts-nfe-exib/NFCe.svelte'

  const ed = get(edicao)
  if (!ed || ed.tipo != Dados.NFes) {
    alert('Abertura inválida de página.')
    $goto('/index')
  }
</script>

{#if ed}
  <h1><Voltar /> Detalhes da nota fiscal</h1>
  {#if +ed.dado.infNFe.ide.mod === 55}
    <NFe {ed} />
  {:else}
    <NFCe {ed} />
  {/if}
{/if}
