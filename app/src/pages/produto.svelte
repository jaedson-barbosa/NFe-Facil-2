<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { carregando, edicao, empresa, refEmpresa } from '../code/store'
  import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
  import ProdCadastro from '../parts-produto/ProdCadastro.svelte'
  import { Dados } from '../code/tipos'
  import Voltar from '../components/Voltar.svelte'

  const ed = get(edicao)
  let raiz = ed.tipo === Dados.Produtos ? ed.dado : {}

  const empresaCarregada = get(empresa)

  if (!raiz['ibpt']) raiz['ibpt'] = { isNacional: true }
  let ibpt = raiz['ibpt']

  async function carregarImpostos() {
    const baseUrl = 'https://apidoni.ibpt.org.br/api/v1/produtos?'
    const parametros = new URLSearchParams()
    parametros.append('token', empresaCarregada.tokenIBPT)
    parametros.append('cnpj', empresaCarregada.emit.CNPJ)
    parametros.append('codigo', raiz.prod.NCM)
    parametros.append('uf', empresaCarregada.emit.enderEmit.UF)
    parametros.append('ex', raiz.prod.EXTIPI || 0)
    parametros.append('descricao', raiz.prod.xProd)
    parametros.append('unidadeMedida', raiz.prod.uTrib)
    parametros.append('valor', raiz.prod.vUnTrib)
    parametros.append('gtin', raiz.prod.cEANTrib)
    const url = baseUrl + parametros.toString()
    try {
      const res = await fetch(url)
      const json = await res.json()
      ibpt.federal = ibpt.isNacional ? json.Nacional : json.Importado
      ibpt.estadual = json.Estadual
      ibpt.municipal = json.Municipal
      const [dia, mes, ano] = json.VigenciaFim.split('/')
      const validade = new Date(ano, mes - 1, dia)
      ibpt.validade = Timestamp.fromDate(validade)
    } catch (error) {
      const baseMsg = 'Erro ao tentar consultar os impostos aproximados: '
      alert(baseMsg + error.message)
    }
  }

  async function analisarIBPT() {
    if (
      empresaCarregada.tokenIBPT &&
      (!ibpt.validade || ibpt.validade.toDate() < new Date())
    ) {
      await carregarImpostos()
    }
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
    {#if empresaCarregada.tokenIBPT}
      <label>
        <input type="checkbox" bind:checked={ibpt.isNacional} />
        Usar tributação aproximada para produto nacional
      </label>
    {/if}
    <input type="submit" class="button" value="Salvar" />
  </form>
{/if}
