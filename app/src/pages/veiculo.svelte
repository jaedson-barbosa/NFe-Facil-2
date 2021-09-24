<script lang="ts">
  import { deleteDoc, doc, setDoc } from '@firebase/firestore'
  import { edicao, empresa, refEmpresa } from '../code/store'
  import { Dados } from '../code/tipos'
  import { EstadosEX } from '../code/IBGE'
  import Voltar from '../components/Voltar.svelte'
  import { get } from 'svelte/store'
  import { goto } from '@roxi/routify'

  let loading = false
  let raiz: IVeiculo = undefined

  const ed = get(edicao)
  if (ed) {
    if (ed.tipo != Dados.Veiculos) $edicao = undefined
    else raiz = { ...ed.dado }
  } else raiz = { placa: '', UF: get(empresa).emit.enderEmit.UF }

  interface IVeiculo {
    placa: string
    UF: string
    RNTC?: string
  }

  async function salvar() {
    loading = true
    if (ed.dado && ed.dado.placa != raiz.placa) {
      const ref = doc($refEmpresa, Dados.Veiculos, ed.dado.placa)
      await deleteDoc(ref)
    }
    const ref = doc($refEmpresa, Dados.Veiculos, raiz.placa)
    await setDoc(ref, raiz)
    $goto('./')
    loading = false
  }
</script>

<h1><Voltar /> {$edicao ? 'Atualização' : 'Adição'} cadastral</h1>
{#if loading}
  Carregando...
{:else}
  <form on:submit|preventDefault={salvar}>
    <h2>Veículo</h2>
    <label>
      Placa
      <input
        bind:value={raiz.placa}
        pattern={'[A-Z]{2,3}[0-9]{4}|[A-Z]{3,4}[0-9]{3}|[A-Z0-9]{7}'}
        required
      />
    </label>
    <label>
      Estado
      <select bind:value={raiz.UF} required>
        {#each EstadosEX as uf}
          <option value={uf.Sigla}>{uf.Nome}</option>
        {/each}
      </select>
    </label>
    <label>
      <i>RNTC</i>
      <input bind:value={raiz.RNTC} minlength="1" maxlength="20" required />
    </label>
  </form>
{/if}
