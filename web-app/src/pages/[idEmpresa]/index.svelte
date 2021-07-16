<script lang="ts">
  import { url } from '@roxi/routify'
  import { applyMask } from '@app/documentUtils'
  import type { TCadastro } from './_components/Search.svelte'
  import Search from './_components/Search.svelte'
  import { statusServico } from '@app/functions'
  import { user, empresa, idEmpresa, dbColumns, userStatus } from '@app/store'

  function getDocDest(v: TCadastro) {
    const cpf = v.get('dest.CPF')
    if (cpf) return applyMask(cpf, 'cpf')
    const cnpj = v.get('dest.CNPJ')
    if (cnpj) return applyMask(cnpj, 'cnpj')
    const idEstrangeiro = v.get('dest.idEstrangeiro')
    return idEstrangeiro
  }

  function getDocTransporta(v: TCadastro) {
    const cpf = v.get('transporta.CPF')
    if (cpf) return applyMask(cpf, 'cpf')
    const cnpj = v.get('transporta.CNPJ')
    return applyMask(cnpj, 'cnpj')
  }

  async function consultar() {
    const token = await $user.getIdToken()
    const resp = await statusServico($idEmpresa)
    if (typeof resp == 'string') alert(resp)
  }

  $: NFCeHabilitado = $empresa?.serieNFCe && $empresa?.IDCSC && $empresa?.CSC

  let exibicao:
    | 'Nada'
    | 'Clientes'
    | 'Produtos'
    | 'Transportes'
    | 'NF-es salvas'
    | 'NF-es emitidas'
    | 'NFC-es salvas'
    | 'NFC-es emitidas' = 'Nada'
</script>

<div class="container">
  {#if $userStatus == 4}
    <a class="button" href={$url('./cadastro')}> Atualizar cadastro </a>
    <a class="button" href={$url('./importacao')}> Importar notas fiscais </a>
  {/if}
  <button on:click={consultar}> Consultar status do serviço </button>
  <a class="button" href={$url('../')}> Trocar emitente </a>
  <label>
    Visualizar
    <select bind:value={exibicao}>
      <option>Nada</option>
      <option>Clientes</option>
      <option>Produtos</option>
      <option>Transportes</option>
      <option>NF-es salvas</option>
      <option>NF-es emitidas</option>
      {#if NFCeHabilitado}
        <option>NFC-es salvas</option>
        <option>NFC-es emitidas</option>
      {/if}
    </select>
  </label>
  {#if exibicao == 'Clientes'}
    <Search
      coluna={$dbColumns.clientes}
      editUrl="./cliente/:id"
      addUrl="./cliente"
      placeholder="Nome do cliente"
      wherePath="dest.xNome"
      headers={['Documento', 'Nome']}
      itemRender={(v) => [getDocDest(v), v.get('dest.xNome')]}
    />
  {:else if exibicao == 'Produtos'}
    <Search
      coluna={$dbColumns.produtos}
      editUrl="./produto/:id"
      addUrl="./produto"
      placeholder="Descrição do produto"
      wherePath="det.prod.xProd"
      headers={['Código', 'Descrição']}
      itemRender={(v) => [v.get('det.prod.cProd'), v.get('det.prod.xProd')]}
    />
  {:else if exibicao == 'Transportes'}
    <Search
      coluna={$dbColumns.transportes}
      editUrl="./transporte/:id"
      addUrl="./transporte"
      placeholder="Nome do transportador"
      wherePath="transporta.xNome"
      headers={['Documento', 'Nome']}
      itemRender={(v) => [getDocTransporta(v), v.get('transporta.xNome')]}
    />
  {:else if exibicao == 'NF-es salvas'}
    <Search
      coluna={$dbColumns.notasSalvas}
      editUrl="./nfe/:id/salva"
      addUrl="./nfe/nova"
      placeholder="Número da NFe salva"
      wherePath="infNFe.ide.nNF"
      headers={['Número', 'Série', 'Emissão', 'Ambiente']}
      itemRender={(v) => [
        v.get('infNFe.ide.nNF'),
        v.get('infNFe.ide.serie'),
        v.get('dhEmi').toDate().toLocaleString(),
        v.get('infNFe.ide.tpAmb') == '1' ? 'Produção' : 'Homologação',
      ]}
    />
  {:else if exibicao == 'NF-es emitidas'}
    <Search
      coluna={$dbColumns.notasEmitidas}
      editUrl="./nfe/:id/emitida"
      addUrl="./nfe/nova"
      placeholder="Número da NFe emitida"
      wherePath="infNFe.ide.nNF"
      headers={['Número', 'Série', 'Emissão', 'Ambiente']}
      itemRender={(v) => [
        v.get('infNFe.ide.nNF'),
        v.get('infNFe.ide.serie'),
        v.get('dhEmi').toDate().toLocaleString(),
        v.get('infNFe.ide.tpAmb') == '1' ? 'Produção' : 'Homologação',
      ]}
    />
  {:else if exibicao == 'NFC-es salvas'}
    <Search
      coluna={$dbColumns.notasCSalvas}
      editUrl="./nfe/:id/csalva"
      addUrl="./nfe/cnova"
      placeholder="Número da NFCe salva"
      wherePath="infNFe.ide.nNF"
      headers={['Número', 'Série', 'Emissão', 'Ambiente']}
      itemRender={(v) => [
        v.get('infNFe.ide.nNF'),
        v.get('infNFe.ide.serie'),
        v.get('dhEmi').toDate().toLocaleString(),
        v.get('infNFe.ide.tpAmb') == '1' ? 'Produção' : 'Homologação',
      ]}
    />
  {:else if exibicao == 'NFC-es emitidas'}
    <Search
      coluna={$dbColumns.notasCEmitidas}
      editUrl="./nfe/:id/cemitida"
      addUrl="./nfe/cnova"
      placeholder="Número da NFCe emitida"
      wherePath="infNFe.ide.nNF"
      headers={['Número', 'Série', 'Emissão', 'Ambiente']}
      itemRender={(v) => [
        v.get('infNFe.ide.nNF'),
        v.get('infNFe.ide.serie'),
        v.get('dhEmi').toDate().toLocaleString(),
        v.get('infNFe.ide.tpAmb') == '1' ? 'Produção' : 'Homologação',
      ]}
    />
  {/if}
</div>
