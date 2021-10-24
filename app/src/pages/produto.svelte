<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import {
    carregando,
    edicao,
    perfisTributarios,
    refEmpresa,
  } from '../code/store'
  import { doc, getDoc, setDoc } from 'firebase/firestore'
  import ProdCadastro from '../parts-produto/ProdCadastro.svelte'
  import { Dados } from '../code/tipos'
  import Voltar from '../components/Voltar.svelte'
  import { carregarAproximacao } from '../code/imposto/aproximado'

  const ed = get(edicao)
  let raiz = ed?.tipo === Dados.Produtos ? ed.dado : {}

  if (!raiz['ibpt']) raiz['ibpt'] = { isNacional: true }
  let ibpt = raiz['ibpt']

  async function analisarIBPT() {
    if (ibpt.validade && ibpt.validade.toDate() > new Date()) return
    raiz['ibpt'] = await carregarAproximacao(raiz.prod, ibpt.isNacional)
  }

  async function salvar() {
    $carregando = true
    try {
      const id = raiz.prod.cProd
      const prodRef = doc(refEmpresa, Dados.Produtos, id)
      if (ed) {
        if (ed.id != id) {
          alert('Não é permitido alterar o código ou CFOP (por enquanto).')
          $carregando = false
          return
        }
      } else {
        const doc = await getDoc(prodRef)
        const msg =
          'Já existe um produto cadastrado com este código. ' +
          'Deseja substituí-lo?'
        if (doc.exists && !confirm(msg)) {
          $carregando = false
          return
        }
      }
      await analisarIBPT()
      await setDoc(prodRef, raiz)
      $goto('./')
      $carregando = false
    } catch (error) {
      console.error(error)
      alert(error.message)
      $carregando = false
    }
  }
</script>

{#if !$carregando}
  <form on:submit|preventDefault={salvar}>
    <h1><Voltar /> Produto</h1>
    <ProdCadastro bind:prod={raiz.prod} />
    <label>
      Perfil de tributação padrão
      <select bind:value={raiz.perfilTributario} required>
        {#each $perfisTributarios as n}
          <option value={n.id}>{n.descricao}</option>
        {/each}
      </select>
    </label>
    <label>
      Usar tributação aproximada para produto
      <select bind:value={ibpt.isNacional} required>
        <option value={true}>Nacional</option>
        <option value={false}>Importado</option>
      </select>
    </label>
    <input type="submit" class="button" value="Salvar" />
  </form>
{/if}
