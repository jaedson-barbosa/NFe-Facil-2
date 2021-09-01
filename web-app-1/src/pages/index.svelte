<script lang="ts">
  import { gerarDANFENFe } from '../code/nfe/geracaoDANFE'
  import { cancelarNFe } from '../code/nfe/cancelamento'
  import {
    Dados,
    edicao,
    idEmpresa,
    liberacoes,
    refEmpresa,
  } from '../code/store'
  import { aplicarMascara } from '../code/mascaracaoDoc'
  import { goto, url } from '@roxi/routify'
  import { debounce } from 'lodash-es'
  import {
    collection,
    DocumentSnapshot,
    limit,
    orderBy,
    query,
    where,
    startAfter,
    getDocs,
  } from '@firebase/firestore'
  import { QueryConstraint } from 'firebase/firestore'

  $edicao = undefined

  function getRotulo(atual: Dados) {
    switch (atual) {
      case Dados.Clientes:
        return 'Nome do cliente'
      case Dados.Produtos:
        return 'Descrição do produto'
      case Dados.Transportes:
        return 'Nome do transportador'
      default:
        return 'Número'
    }
  }

  function getAddUrl(atual: Dados) {
    switch (atual) {
      case Dados.Clientes:
        return './cliente'
      case Dados.Produtos:
        return './produto'
      case Dados.Transportes:
        return './transporta'
      default:
        return './nfe'
    }
  }

  function getCampoBusca(atual: Dados) {
    switch (atual) {
      case Dados.Clientes:
        return 'dest.xNome'
      case Dados.Produtos:
        return 'det.prod.xProd'
      case Dados.Transportes:
        return 'transporta.xNome'
      default:
        return 'infNFe.ide.nNF'
    }
  }

  function getCabecalhos(atual: Dados) {
    switch (atual) {
      case Dados.Clientes:
        return ['Documento', 'Nome']
      case Dados.Produtos:
        return ['Código', 'Descrição']
      case Dados.Transportes:
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

  function getDocDest(v: DocumentSnapshot) {
    const cpf = v.get('dest.CPF')
    if (cpf) return aplicarMascara(cpf, 'cpf')
    const cnpj = v.get('dest.CNPJ')
    if (cnpj) return aplicarMascara(cnpj, 'cnpj')
    const idEstrangeiro = v.get('dest.idEstrangeiro')
    return idEstrangeiro
  }

  function getDocTransporta(v: DocumentSnapshot) {
    const cpf = v.get('transporta.CPF')
    if (cpf) return aplicarMascara(cpf, 'cpf')
    const cnpj = v.get('transporta.CNPJ')
    return aplicarMascara(cnpj, 'cnpj')
  }

  function getItemRender(busca: Dados): (v: DocumentSnapshot) => string[] {
    switch (busca) {
      case Dados.Clientes:
        return (v) => [getDocDest(v), v.get('dest.xNome')]
      case Dados.Produtos:
        return (v) => [v.get('det.prod.cProd'), v.get('det.prod.xProd')]
      case Dados.Transportes:
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

  function edit(cad: DocumentSnapshot, tipo: Dados) {
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

  let dadosAtual: Dados = Dados.Clientes

  $: isDadoSimples = ['Clientes', 'Produtos', 'Transportes'].includes(
    dadosAtual
  )
  $: rotulo = getRotulo(dadosAtual)
  $: addUrl = getAddUrl(dadosAtual)
  $: campoBusca = getCampoBusca(dadosAtual)
  $: cabecalhos = getCabecalhos(dadosAtual)
  $: itemRender = getItemRender(dadosAtual)
  $: reset(dadosAtual)
  const niveisEscrita = [NiveisAcesso.RW, NiveisAcesso.A]
  $: writePermission = niveisEscrita.includes($liberacoes[$idEmpresa])

  let cadastros: DocumentSnapshot[] = []
  let lastBusca = ''
  let hasMore = false

  async function buscar(busca: string = lastBusca) {
    hasMore = false
    const coluna = collection($refEmpresa, dadosAtual)
    const limites: QueryConstraint[] = [limit(10), orderBy(campoBusca, 'desc')]
    if (busca != lastBusca) {
      cadastros = []
      limites.push(where(campoBusca, '>=', busca))
    } else if (cadastros.length) {
      const ultimo = cadastros[cadastros.length - 1]
      limites.push(startAfter(ultimo))
    }
    const consulta = query(coluna, ...limites)
    const docs = await getDocs(consulta)
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
              {cad.get('nProt') ? 'Clonar' : 'Editar'}
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
              <button
                on:click|once={() => gerarDANFENFe($idEmpresa, cad.id, true)}
              >
                Gerar DANFE
              </button>
              <button on:click|once={() => cancelarNFe($idEmpresa, cad.id)}>
                Cancelar
              </button>
            {:else}
              <button
                on:click|once={() => gerarDANFENFe($idEmpresa, cad.id, false)}
              >
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
