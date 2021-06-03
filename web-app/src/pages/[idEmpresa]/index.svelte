<script lang="ts">
  import { url } from '@roxi/routify'
  import { applyMask } from '@app/documentUtils'
  import type { TCadastro } from './_components/Search.svelte'
  import Search from './_components/Search.svelte'

  export let scoped: { idEmpresa: string }

  function getDocumento(v: TCadastro) {
    const cpf = v.get('dest.CPF')
    if (cpf) return applyMask(cpf, 'cpf')
    const cnpj = v.get('dest.CNPJ')
    if (cnpj) return applyMask(cnpj, 'cnpj')
    const idEstrangeiro = v.get('dest.idEstrangeiro')
    return idEstrangeiro
  }
</script>

<div class="columns is-multiline">
  <div class="column is-half">
    <div class="container content box">
      <div class="buttons">
        <a class="button is-fullwidth" href={$url('./cadastro')}>
          Atualizar cadastro
        </a>
        <a class="button is-fullwidth" href={$url('../')}> Trocar emitente </a>
      </div>
    </div>
  </div>
  <div class="column is-half">
    <Search
      coluna="clientes"
      editUrl="cliente"
      idEmpresa={scoped.idEmpresa}
      placeholder="Nome do cliente"
      wherePath="dest.xNome"
      headers={['Documento', 'Nome']}
      itemRender={(v) => [getDocumento(v), v.get('dest.xNome')]}
    />
  </div>
  <div class="column is-half">
    <Search
      coluna="produtos"
      editUrl="produto"
      idEmpresa={scoped.idEmpresa}
      placeholder="Descrição do produto"
      wherePath="det.prod.xProd"
      headers={['Código', 'Descrição']}
      itemRender={(v) => [v.get('det.prod.cProd'), v.get('det.prod.xProd')]}
    />
  </div>
  <div class="column is-half">
    <Search
      coluna="transportes"
      editUrl="transporte"
      idEmpresa={scoped.idEmpresa}
      placeholder="Identificador"
      wherePath="identificador"
      headers={['Identificador']}
      itemRender={(v) => [v.get('identificador')]}
    />
  </div>
  <div class="column is-half">
    <Search
      coluna="notasSalvas"
      editUrl="nfe"
      idEmpresa={scoped.idEmpresa}
      placeholder="Número da NFe"
      wherePath="infNFe.ide.nNF"
      headers={['Número', 'Série', 'Emissão']}
      itemRender={(v) => [
        v.get('infNFe.ide.nNF'),
        v.get('infNFe.ide.serie'),
        v.get('dhEmi').toDate().toLocaleString(),
      ]}
    />
  </div>
  <div class="column is-half">
    <Search
      coluna="notasEmitidas"
      editUrl="nfe"
      idEmpresa={scoped.idEmpresa}
      placeholder="Número da NFe"
      wherePath="infNFe.ide.nNF"
      headers={['Número', 'Série', 'Emissão']}
      itemRender={(v) => [
        v.get('infNFe.ide.nNF'),
        v.get('infNFe.ide.serie'),
        v.get('dhEmi').toDate().toLocaleString(),
      ]}
    />
  </div>
</div>
