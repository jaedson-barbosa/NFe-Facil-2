<script lang="ts">
  import { gerarDANFENFe } from '../code/nfe/geracaoDANFE'
  import { userStatus, dbColumns, edicao, idEmpresa } from '../code/store'
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import type { TCadastro, Dados } from '../code/store'
  import { goto, url } from '@roxi/routify'
  import { debounce } from 'lodash-es'

  $edicao = undefined

  function getColuna() {
    switch (dadosAtual) {
      case 'Clientes':
        return $dbColumns.clientes
      case 'Produtos':
        return $dbColumns.produtos
      case 'Transportes':
        return $dbColumns.transportes
      case 'NFes':
        return $dbColumns.nfes
      case 'NFCes':
        return $dbColumns.nfces
    }
  }

  function getRotulo(atual: Dados) {
    switch (atual) {
      case 'Clientes':
        return 'Nome do cliente'
      case 'Produtos':
        return 'Descrição do produto'
      case 'Transportes':
        return 'Nome do transportador'
      default:
        return 'Número'
    }
  }

  function getAddUrl(atual: Dados) {
    switch (atual) {
      case 'Clientes':
        return './cliente'
      case 'Produtos':
        return './produto'
      case 'Transportes':
        return './transporta'
      default:
        return './nfe'
    }
  }

  function getCampoBusca(atual: Dados) {
    switch (atual) {
      case 'Clientes':
        return 'dest.xNome'
      case 'Produtos':
        return 'det.prod.xProd'
      case 'Transportes':
        return 'transporta.xNome'
      default:
        return 'infNFe.ide.nNF'
    }
  }

  function getCabecalhos(atual: Dados) {
    switch (atual) {
      case 'Clientes':
        return ['Documento', 'Nome']
      case 'Produtos':
        return ['Código', 'Descrição']
      case 'Transportes':
        return ['Documento', 'Nome']
      default:
        return [
          'Número',
          'Série',
          'Data e hora',
          'Cliente',
          'Status',
          'Ambiente',
        ]
    }
  }

  function getDocDest(v: TCadastro) {
    const cpf = v.get('dest.CPF')
    if (cpf) return aplicarMascara(cpf, 'cpf')
    const cnpj = v.get('dest.CNPJ')
    if (cnpj) return aplicarMascara(cnpj, 'cnpj')
    const idEstrangeiro = v.get('dest.idEstrangeiro')
    return idEstrangeiro
  }

  function getDocTransporta(v: TCadastro) {
    const cpf = v.get('transporta.CPF')
    if (cpf) return aplicarMascara(cpf, 'cpf')
    const cnpj = v.get('transporta.CNPJ')
    return aplicarMascara(cnpj, 'cnpj')
  }

  function getItemRender(busca: Dados): (v: TCadastro) => string[] {
    switch (busca) {
      case 'Clientes':
        return (v) => [getDocDest(v), v.get('dest.xNome')]
      case 'Produtos':
        return (v) => [v.get('det.prod.cProd'), v.get('det.prod.xProd')]
      case 'Transportes':
        return (v) => [getDocTransporta(v), v.get('transporta.xNome')]
      default:
        return (v) => {
          const cancelada = v.get('cancelada')
          return [
            v.get('infNFe.ide.nNF'),
            v.get('infNFe.ide.serie'),
            v.get('dhEmi').toDate().toLocaleString(),
            v.get('infNFe.dest.xNome') ?? 'Não informado',
            cancelada
              ? 'Cancelada'
              : cancelada === false
              ? 'Emitida'
              : 'Apenas salva',
            v.get('infNFe.ide.tpAmb') == '1' ? 'Produção' : 'Homologação',
          ]
        }
    }
  }

  function edit(cad: TCadastro, tipo: Dados) {
    $edicao = {
      dado: cad.data(),
      id: cad.id,
      tipo,
    }
    $goto(addUrl)
  }

  function reset(_atual: Dados) {
    cadastros = []
    lastBusca = ''
    hasMore = false
    buscar()
  }

  let dadosAtual: Dados = 'Clientes'

  $: isDadoSimples = ['Clientes', 'Produtos', 'Transportes'].includes(dadosAtual)
  $: rotulo = getRotulo(dadosAtual)
  $: addUrl = getAddUrl(dadosAtual)
  $: campoBusca = getCampoBusca(dadosAtual)
  $: cabecalhos = getCabecalhos(dadosAtual)
  $: itemRender = getItemRender(dadosAtual)
  $: reset(dadosAtual)
  $: writePermission = $userStatus >= 3

  let cadastros: TCadastro[] = []
  let lastBusca = ''
  let hasMore = false

  async function buscar(busca: string = lastBusca) {
    hasMore = false
    let query = getColuna().limit(10).orderBy(campoBusca, 'desc')
    if (busca != lastBusca) {
      cadastros = []
      if (busca) {
        const next = (c: string) => String.fromCharCode(c.charCodeAt(0) + 1)
        const end = busca.replace(/.$/, next)
        query = query.where(campoBusca, '>=', busca).where(campoBusca, '<', end)
      }
    } else if (cadastros.length) {
      const last = cadastros[cadastros.length - 1]
      query = query.startAfter(last)
    }
    const docs = await query.get()
    hasMore = docs.size == 10
    cadastros = [...cadastros, ...docs.docs]
    lastBusca = busca
  }

  function getDownloadLink(xml: string) {
    const blob = new Blob([xml], { type: 'application/xml' })
    return window.URL.createObjectURL(blob)
  }
</script>

<a class="button" href={$url('./emitente')}>Editar dados do emitente</a>

<label>
  Visualização
  <select bind:value={dadosAtual}>
    <option value={'Clientes'}>Clientes</option>
    <option value={'Produtos'}>Produtos</option>
    <option value={'Transportes'}>Transportes</option>
    <option value={'NFes'}>NF-es</option>
    <option value={'NFCes'}>NFC-es</option>
  </select>
</label>

<label>
  {rotulo}
  <input type="text" on:input={debounce((e) => buscar(e.target.value), 300)} />
</label>
{#if writePermission}
  <a class="button" href={$url(addUrl)}>Adicionar</a>
{/if}

<table>
  <thead>
    <tr>
      {#each cabecalhos as h}
        <th>{h}</th>
      {/each}
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {#each cadastros as cad}
      <tr>
        {#each itemRender(cad) as i}
          <td>{i}</td>
        {/each}
        <td>
          {#if isDadoSimples}
            <button on:click|once={() => edit(cad, dadosAtual)}>Editar</button>
          {:else if writePermission}
            <button on:click|once={() => edit(cad, dadosAtual)}>
              {#if dadosAtual == 'NFesSalvas' || Dados.NFCesSalvas}
                Editar
              {:else}
                Clonar
              {/if}
            </button>
            <a
              class="button"
              href={getDownloadLink(cad.get('xml'))}
              download={cad.id}
            >
              Baixar XML
            </a>
            {#if cad.get('cancelada')}
              <a
                class="button"
                href={getDownloadLink(cad.get('xmlCancelamento'))}
                download={'cancel' + cad.id}
              >
                Baixar XML de cancelamento
              </a>
            {:else if cad.get('cancelada') === false}
              <button on:click|once={() => danfeNFe($idEmpresa, cad.id, true)}>
                Gerar DANFE
              </button>
              <button on:click|once={() => cancelarNFe($idEmpresa, cad.id)}>
                Cancelar
              </button>
            {:else}
              <button on:click|once={() => danfeNFe($idEmpresa, cad.id, false)}>
                Gerar DANFE
              </button>
            {/if}
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
  {#if hasMore}
    <tfoot>
      <tr>
        <td colspan="6">
          <button class="button" on:click={() => buscar()}>
            Carregar mais
          </button>
        </td>
      </tr>
    </tfoot>
  {/if}
</table>
