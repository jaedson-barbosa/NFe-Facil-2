<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { validaCPF, validaCNPJ } from '../code/validacaoDoc'
  import { edicao, permissaoEscrita, refEmpresa } from '../code/store'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  import { Dados } from '../code/tipos'
  import Voltar from '../components/Voltar.svelte'
  import InputT from '../components/InputT.svelte'
  import Municipio from '../components/Municipio.svelte'
  import Doc from '../parts-nfe/Doc.svelte'

  let loading = false
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
    loading = true
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
          loading = false
          return
        }
      } else {
        const doc = await getDoc(docRef)
        const msg =
          'Já existe um transportador cadastrado com este documento. ' +
          'Deseja substituí-lo?'
        if (doc.exists && !confirm(msg)) {
          loading = false
          return
        }
      }
      await setDoc(docRef, raiz)
      $edicao = undefined
      $goto('./')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

<h1><Voltar /> {$edicao ? 'Atualização' : 'Adição'} cadastral</h1>
{#if loading}
  Carregando...
{:else}
  <form on:submit|preventDefault={() => salvar()}>
    <h2>Transportador</h2>
    <Doc bind:raiz={transporta} apenasBR />
    <InputT
      lab="Razão Social ou nome do transportador"
      min={2}
      max={60}
      bind:val={transporta['xNome']}
    />
    <InputT
      opt
      lab="Inscrição Estadual"
      pat={'ISENTO|[0-9]{2,14}'}
      max={14}
      bind:val={transporta['IE']}
    />
    <InputT
      opt
      lab="Endereço completo"
      min={1}
      max={60}
      bind:val={transporta['xEnder']}
    />
    <Municipio bind:xMun={transporta['xMun']} bind:UF={transporta['UF']} />
    {#if $permissaoEscrita}
      <input type="submit" class="button" value="Salvar" />
    {/if}
  </form>
{/if}
