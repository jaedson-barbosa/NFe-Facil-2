<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { validaCPF, validaCNPJ } from '../code/validacaoDoc'
  import { carregando, edicao, refEmpresa } from '../code/store'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  import { Dados } from '../code/tipos'
  import Voltar from '../components/Voltar.svelte'
  import Municipio from '../components/Municipio.svelte'
  import Doc from '../components/Doc.svelte'
  import { pattern } from '../code/patterns'

  const ed = get(edicao)
  const paginaAnterior = ed?.tipo === Dados.NFes ? './nfe' : './'
  let raiz = ed?.tipo === Dados.Transportes ? ed.dado : {}

  if (!raiz['transporta']) raiz['transporta'] = {}
  let transporta = raiz['transporta']

  async function salvar() {
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
      const docRef = doc(refEmpresa, Dados.Transportes, id)
      if (ed?.tipo === Dados.Transportes) {
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
      $goto(paginaAnterior)
      $carregando = false
    } catch (error) {
      alert(error.message)
      $carregando = false
    }
  }
</script>

{#if !$carregando}
  <form on:submit|preventDefault={() => salvar()}>
    <h1><Voltar href={paginaAnterior} /> Transportador</h1>
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
    <input type="submit" class="button" value="Salvar" />
  </form>
{/if}
