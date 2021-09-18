<script lang="ts">
  import Ide from './Ide.svelte'
  import Local from './Local.svelte'
  import Doc from './Doc.svelte'
  import ExibDoc from './ExibDoc.svelte'
  import AutXml from './AutXML.svelte'
  import Det from './Det.svelte'
  import Total from './Total.svelte'
  import Transp from './Transp.svelte'
  import Pag from './Pag.svelte'
  import InfAdic from './InfAdic.svelte'
  import { DocumentSnapshot } from 'firebase/firestore'
  import { empresa, refEmpresa } from '../code/store'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { get } from 'svelte/store'

  export let raiz: any
  if (!raiz.emit) raiz.emit = get(empresa).emit
  let regimeNormal = raiz.emit.CRT == '3'

  if (!raiz.dest) raiz.dest = {}
  if (!raiz.det) raiz.det = []
  raiz.infRespTec = {
    CNPJ: '12931158000164',
    xContato: 'Jaedson Barbosa Serafim',
    email: 'jaedson33@gmail.com',
    fone: '83988856440',
  }

  $: dest = raiz['dest']
  $: destComDoc = dest?.CPF || dest?.CNPJ || dest?.idEstrangeiro
  $: destSemNome = !dest?.xNome

  let clientes = [] as DocumentSnapshot[]
  const buscadorCliente = new Buscador(
    $refEmpresa,
    Dados.Clientes,
    'dest.xNome',
    'asc',
    (v) => (clientes = v)
  )

  let produtos = [] as DocumentSnapshot[]
  const buscadorProduto = new Buscador(
    $refEmpresa,
    Dados.Produtos,
    'det.prod.xProd',
    'asc',
    (v) => (produtos = v)
  )

  let produtoExibido = -1
  function escolherProduto(cad: DocumentSnapshot) {
    raiz.det = [cad.data(), ...raiz.det]
    produtoExibido = 0
  }

  function exibirProduto(e: Event) {
    const dialog: any = e.target as HTMLDialogElement
    dialog.showModal()
  }

  function removerExibido() {
    produtoExibido = -1
    raiz.det.splice(produtoExibido, 1)
    raiz = raiz
  }

  $: isNFCe = raiz['ide']?.['mod'] === '65'
</script>

<h2>Emissão de nota fiscal</h2>

<Ide {raiz} />

<h3>Destinatário</h3>
{#if isNFCe && destSemNome}
  <Doc raiz={dest} />
{/if}
{#if !isNFCe && !(destComDoc && destSemNome)}
  <label>
    Buscar por nome
    <input on:input={buscadorCliente.buscar} />
  </label>
  <table>
    <thead>
      <tr>
        <th>Documento</th>
        <th>Nome</th>
      </tr>
    </thead>
    <tbody>
      {#each clientes as c}
        <tr
          class="clicavel"
          class:marcado={dest?.xNome == c.get('dest.xNome')}
          on:click={() => (dest = c.data())}
        >
          <td>
            <ExibDoc
              CPF={c.get('dest.CPF')}
              CNPJ={c.get('dest.CNPJ')}
              idEstrangeiro={c.get('dest.idEstrangeiro')}
            />
          </td>
          <td>{c.get('dest.xNome')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<Local {raiz} name="retirada" />
<Local {raiz} name="entrega" />

<AutXml {raiz} />

<h3>Produtos</h3>
<label>
  Buscar produto pela descrição
  <input on:input={buscadorProduto.buscar} />
</label>
<table>
  <thead>
    <tr>
      <th>Código</th>
      <th>Descrição</th>
    </tr>
  </thead>
  <tbody>
    {#each produtos as p}
      <tr class="clicavel" on:click={() => escolherProduto(p)}>
        <td>{p.get('det.prod.cProd')}</td>
        <td>{p.get('det.prod.xProd')}</td>
      </tr>
    {/each}
  </tbody>
</table>
<h4>Produtos adicionados</h4>
<table>
  <thead>
    <tr>
      <th>Código</th>
      <th>Descrição</th>
      <th>Valor bruto</th>
    </tr>
  </thead>
  <tbody>
    {#each raiz.det as p, i}
      <tr on:click={() => (produtoExibido = i)}>
        <td>{p['prod']['cProd']}</td>
        <td>{p['prod']['xProd']}</td>
        <td>{p['prod']['vProd']}</td>
      </tr>
    {/each}
  </tbody>
</table>
{#if produtoExibido != -1}
  <dialog on:load={exibirProduto} on:close={() => (produtoExibido = -1)}>
    <form method="dialog">
      <Det
        raiz={raiz.det[produtoExibido]}
        {regimeNormal}
        consumidorFinal={raiz.ide.indFinal == '1'}
      />
      <button type="button" on:click={removerExibido}>Remover</button>
      <input type="submit" value="Salvar" />
    </form>
  </dialog>
{/if}

<Total {raiz} />
<Transp {raiz} />
<Pag {raiz} total={raiz.total?.ICMSTot?.vNF ?? 0} />
<InfAdic {raiz} />
