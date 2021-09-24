<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao, empresa, permissaoEscrita, refEmpresa } from '../code/store'
  import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
  import ProdCadastro from '../parts-nfe/ProdCadastro.svelte'
  import { Dados } from '../code/tipos'
  import Voltar from '../components/Voltar.svelte'
  import Imposto from '../parts-nfe/Imposto.svelte'

  let loading = false
  let raiz = undefined

  const empresaCarregada = get(empresa)
  const regimeNormal = empresaCarregada.emit.CRT == '3'

  const ed = get(edicao)
  if (ed) {
    if (ed.tipo != Dados.Produtos) $edicao = undefined
    else raiz = { ...ed.dado }
  } else raiz = {}

  if (!raiz['det']) raiz['det'] = {}
  let det = raiz['det']

  if (!raiz['ibpt']) raiz['ibpt'] = { ex: 0, isNacional: true }
  let ibpt = raiz['ibpt']

  async function carregarImpostos() {
    if (!ibpt.ex) ibpt.ex = 0
    const baseUrl = 'https://apidoni.ibpt.org.br/api/v1/produtos?'
    const parametros = new URLSearchParams()
    parametros.append('token', empresaCarregada.tokenIBPT)
    parametros.append('cnpj', empresaCarregada.emit.CNPJ)
    parametros.append('codigo', det.prod.NCM)
    parametros.append('uf', empresaCarregada.emit.enderEmit.UF)
    parametros.append('ex', ibpt.ex)
    parametros.append('descricao', det.prod.xProd)
    parametros.append('unidadeMedida', det.prod.uTrib)
    parametros.append('valor', det.prod.vUnTrib)
    parametros.append('gtin', det.prod.cEANTrib)
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

  async function salvar() {
    if (!$permissaoEscrita) {
      $goto('./')
      return
    }
    loading = true
    try {
      const det = raiz.det
      const id = det.prod.cProd
      const prodRef = doc($refEmpresa, Dados.Produtos, id)
      if (ed) {
        if (ed.id != id) {
          alert('Não é permitido alterar o código (por enquanto).')
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
      $goto('./')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

{#if loading}
  Carregando...
{:else}
  <form on:submit|preventDefault={() => salvar()}>
    <h1><Voltar /> Produto</h1>
    <ProdCadastro bind:raiz={det} />
    <Imposto bind:raiz={det} {regimeNormal} />
    {#if empresaCarregada.tokenIBPT}
      <h3>Imposto aproximado</h3>
      <label>
        Código da exceção à regra aplicada na NCM
        <small>Caso não haja informe 0</small>
        <input bind:value={ibpt.ex} />
      </label>
      <label>
        <input type="checkbox" bind:checked={ibpt.isNacional} />
        Produto nacional
      </label>
      {#if ibpt.validade}
        <p>
          Aproximação válida até {ibpt.validade.toDate().toLocaleDateString()}:
          <br />
          Federal:
          <i>{ibpt.federal} %</i>
          <br />
          Estadual:
          <i>{ibpt.estadual} %</i>
          <br />
          Municipal:
          <i>{ibpt.municipal} %</i>
        </p>
      {:else}
        <button type="button" on:click={carregarImpostos}>
          Carregar impostos
        </button>
      {/if}
    {/if}
    {#if permissaoEscrita}
      <input type="submit" class="button" />
    {/if}
  </form>
{/if}
