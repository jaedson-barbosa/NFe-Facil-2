<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { validaCPF, validaCNPJ } from '../code/validacaoDoc'
  import {
    carregando,
    edicao,
    permissaoEscrita,
    refEmpresa,
  } from '../code/store'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  import { Dados } from '../code/tipos'
  import Voltar from '../components/Voltar.svelte'
  import Municipio from '../components/Municipio.svelte'
  import Doc from '../components/Doc.svelte'
  import { pattern } from '../code/patterns'

  let raiz = undefined

  const ed = get(edicao)
  if (ed) {
    if (ed.tipo != Dados.Transportes) $edicao = undefined
    else raiz = { ...ed.dado }
  } else raiz = {}

  if (!raiz['transporta']) raiz['transporta'] = {}
  let transporta = raiz['transporta']

  async function salvar() {
    if (!$permissaoEscrita) {
      $goto('./')
      return
    }
    $carregando = true
    try {
      const transporta = raiz.transporta
      if (transporta.CPF && !validaCPF(transporta.CPF)) {
        alert('CPF inválido.')
        return
      }
      if (transporta.CNPJ && !validaCNPJ(transporta.CNPJ)) {
        alert('CNPJ inválido.')
        return
      }
      const id = transporta.CPF ? transporta.CPF : transporta.CNPJ
      const docRef = doc($refEmpresa, Dados.Transportes, id)
      if (ed) {
        if (ed.id != id) {
          alert('Não é permitido alterar o documento.')
          $carregando = false
          return
        }
      } else {
        const doc = await getDoc(docRef)
        const msg =
          'Já existe um transportador cadastrado com este documento. ' +
          'Deseja substituí-lo?'
        if (doc.exists && !confirm(msg)) {
          $carregando = false
          return
        }
      }
      await setDoc(docRef, raiz)
      $edicao = undefined
      $goto('./')
    } catch (error) {
      alert(error.message)
      $carregando = false
    }
  }
</script>

{#if !$carregando}
  <form on:submit|preventDefault={() => salvar()}>
    <h1><Voltar /> Transportador</h1>
    <Doc bind:raiz={transporta} apenasBR />
    <label>
      Razão Social ou nome do transportador
      <input
        minlength="2"
        maxlength="60"
        bind:value={transporta['xNome']}
        required
      />
    </label>
    <label>
      <i>Inscrição Estadual</i>
      <input
        pattern={'ISENTO|[0-9]{2,14}'}
        maxlength="14"
        bind:value={transporta['IE']}
      />
    </label>
    <label>
      <i>Endereço completo</i>
      <input maxlength="60" bind:value={transporta['xEnder']} {pattern} />
    </label>
    <Municipio bind:xMun={transporta['xMun']} bind:UF={transporta['UF']} />
    {#if $permissaoEscrita}
      <input type="submit" class="button" value="Salvar" />
    {/if}
  </form>
{/if}
