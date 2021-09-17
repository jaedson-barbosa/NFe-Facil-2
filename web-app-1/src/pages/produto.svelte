<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao, empresa, refEmpresa } from '../code/store'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  import ProdCadastro from '../nfe-parts/ProdCadastro.svelte'
  import { Dados } from '../code/tipos'
  import Voltar from '../components/Voltar.svelte'
  import Imposto from './Imposto.svelte'

  let loading = false
  let raiz = undefined

  const regimeNormal = get(empresa).emit.CRT == '3'

  const ed = get(edicao)
  if (ed) {
    if (ed.tipo != Dados.Produtos) $edicao = undefined
    else raiz = { ...ed.dado }
  } else raiz = {}

  async function salvar() {
    loading = true
    try {
      const det = raiz.det
      const id = det.prod.cProd
      const prodRef = doc($refEmpresa, Dados.Produtos, id)
      if (ed) {
        if (ed.id != id) {
          alert('Não é permitido alterar o código.')
          loading = false
          return
        }
      } else {
        const doc = await getDoc(prodRef)
        const msg =
          'Já existe um produto cadastrado com este código. ' +
          'Deseja substituí-lo?'
        if (doc.exists && !confirm(msg)) {
          loading = false
          return
        }
      }
      await setDoc(prodRef, raiz)
      $goto('../')
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
    <ProdCadastro {raiz} />
    <hr />
    <Imposto {raiz} {regimeNormal} />
    <input type="submit" class="button" />
  </form>
{/if}
