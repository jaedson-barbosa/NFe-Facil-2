<script lang="ts">
  import { deleteDoc, doc, setDoc } from '@firebase/firestore'
  import { carregando, edicao, empresa, refEmpresa } from '../code/store'
  import { Dados } from '../code/tipos'
  import { EstadosEX } from '../code/IBGE'
  import Voltar from '../components/Voltar.svelte'
  import { get } from 'svelte/store'
  import { goto } from '@roxi/routify'
  import { pattern } from '../code/patterns'

  const ed = get(edicao)
  const paginaAnterior = ed.tipo === Dados.NFes ? './nfe' : './'
  let raiz: IVeiculo =
    ed?.tipo === Dados.Veiculos
      ? ed.dado
      : { placa: '', UF: get(empresa).emit.enderEmit.UF }

  interface IVeiculo {
    placa: string
    UF: string
    RNTC?: string
  }

  async function salvar() {
    $carregando = true
    if (
      ed?.tipo === Dados.Veiculos &&
      ed?.dado &&
      ed.dado.placa != raiz.placa
    ) {
      const ref = doc($refEmpresa, Dados.Veiculos, ed.dado.placa)
      await deleteDoc(ref)
    }
    const ref = doc($refEmpresa, Dados.Veiculos, raiz.placa)
    await setDoc(ref, raiz)
    $goto(paginaAnterior)
    $carregando = false
  }
</script>

{#if !$carregando}
  <form on:submit|preventDefault={salvar}>
    <h1><Voltar href={paginaAnterior} /> Veículo</h1>
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
      <input bind:value={raiz.RNTC} minlength="1" maxlength="20" {pattern} />
    </label>
    <input type="submit" value="Salvar" />
  </form>
{/if}
