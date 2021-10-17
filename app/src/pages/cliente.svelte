<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { validaCNPJ, validaCPF } from '../code/validacaoDoc'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  import { Dados } from '../code/tipos'
  import Dest from '../parts-cliente.svelte/Dest.svelte'
  import Voltar from '../components/Voltar.svelte'
  import {
    carregando,
    edicao,
    permissaoEscrita,
    refEmpresa,
  } from '../code/store'

  let raiz = undefined

  const ed = get(edicao)
  if (ed) {
    if (ed.tipo != Dados.Clientes) {
      $edicao = undefined
      raiz = {}
    } else raiz = { ...ed.dado }
  } else raiz = {}

  if (!raiz.dest) raiz.dest = {}

  async function salvar() {
    if (!$permissaoEscrita) {
      $goto('./')
      return
    }
    $carregando = true
    try {
      const dest = raiz.dest
      if (dest.CPF && !validaCPF(dest.CPF)) {
        $carregando = false
        alert('CPF inválido.')
        return
      }
      if (dest.CNPJ && !validaCNPJ(dest.CNPJ)) {
        $carregando = false
        alert('CNPJ inválido.')
        return
      }
      const id = dest.CPF
        ? dest.CPF
        : dest.CNPJ
        ? dest.CNPJ
        : dest.idEstrangeiro
      const docRef = doc($refEmpresa, Dados.Clientes, id)
      if (ed && ed.id != id) {
        alert('Não é permitido alterar o documento.')
        $carregando = false
        return
      } else if (
        !ed &&
        (await getDoc(docRef)).exists &&
        !confirm('Já existe um cliente com este documento. Substituir?')
      ) {
        $carregando = false
        return
      }
      await setDoc(docRef, raiz)
      $edicao = undefined
      $goto('./')
    } catch (error) {
      console.error(error)
      alert(error.message)
      $carregando = false
    }
  }
</script>

{#if !$carregando}
  <form on:submit|preventDefault={() => salvar()}>
    <h1><Voltar /> Destinatário</h1>
    <Dest bind:dest={raiz.dest} />
    {#if permissaoEscrita}
      <input type="submit" class="button" />
    {/if}
  </form>
{/if}
