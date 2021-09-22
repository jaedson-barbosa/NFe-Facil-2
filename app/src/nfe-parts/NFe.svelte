<script lang="ts">
  import Ide from './Ide.svelte'
  import Local from './Local.svelte'
  import Doc from './Doc.svelte'
  import ExibDoc from './ExibDoc.svelte'
  import AutXml from './AutXML.svelte'
  import Total from './Total.svelte'
  import Transp from './Transp.svelte'
  import Pag from './Pag.svelte'
  import InfAdic from './InfAdic.svelte'
  import ProdutoSimples from './ProdutoSimples.svelte'
  import Voltar from '../components/Voltar.svelte'
  import { DocumentSnapshot } from 'firebase/firestore'
  import { empresa, refEmpresa } from '../code/store'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { get } from 'svelte/store'
  import { getMoeda } from '../code/numero'

  export let raiz: any
  if (!raiz.emit) raiz.emit = get(empresa).emit

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

  $: isNFCe = raiz['ide']?.['mod'] === '65'

  function ratear(titulo: string, campo: string) {
    return () => {
      const valor = +prompt(`Valor total do ${titulo}:`)
      if (isNaN(valor)) return
      const prods: any[] = raiz.det
      const total = prods.reduce((p, c) => +c.prod.vProd + p, 0)
      prods.forEach((v) => {
        const novo = (valor * v.prod.vProd) / total
        v.prod[campo] = +novo.toFixed(2)
      })
      raiz.det = raiz.det
    }
  }
</script>

{@debug raiz}

<h1><Voltar /> Nota fiscal</h1>

<Ide bind:raiz />

<h2>Destinatário</h2>
{#if isNFCe && destSemNome}
  <p>Numa NFC-e é possível informar apenas o documento do cliente.</p>
  <Doc bind:raiz={raiz.dest} />
{/if}
{#if destComDoc && !isNFCe}
  <p>
    Cliente escolhido: <br />
    Nome:
    <em>{dest.xNome}</em>
    <br />
    Documento:
    <em>
      <ExibDoc
        CPF={dest.CPF}
        CNPJ={dest.CNPJ}
        idEstrangeiro={dest.idEstrangeiro}
      />
    </em>
  </p>
  <button type="button" on:click={() => (raiz.dest = {})}>Trocar</button>
  <br />
{/if}
{#if !destComDoc}
  {#if isNFCe}
    <p>Como também é possível informar todos os dados do cliente.</p>
  {/if}
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
        <tr class="clicavel" on:click={() => (raiz.dest = c.data().dest)}>
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
<br />

<h2>Produtos</h2>
<label>
  Buscar produto pela descrição
  <input on:input={buscadorProduto.buscar} />
</label>
<table>
  <thead>
    <tr>
      <th>Código</th>
      <th>Descrição</th>
      <th>Valor unitário</th>
    </tr>
  </thead>
  <tbody>
    {#each produtos as p}
      <tr
        class="clicavel"
        on:click={() => (raiz.det = [p.data().det, ...raiz.det])}
      >
        <td>{p.get('det.prod.cProd')}</td>
        <td>{p.get('det.prod.xProd')}</td>
        <td>{getMoeda(p.get('det.prod.vUnCom'))}</td>
      </tr>
    {/each}
  </tbody>
</table>
{#if raiz.det.length}
  <h3>Produtos adicionados</h3>
  <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>Quantidade</th>
        <th>Frete</th>
        <th>Seguro</th>
        <th>Desconto</th>
        <th>Adicionais</th>
      </tr>
    </thead>
    <tbody>
      {#each raiz.det as _, i}
        <ProdutoSimples bind:raiz index={i} />
      {/each}
    </tbody>
  </table>
  <button type="button" on:click={ratear('frete', 'vFrete')}>
    Ratear frete
  </button>
  <button type="button" on:click={ratear('seguro', 'vSeg')}>
    Ratear seguro
  </button>
  <button type="button" on:click={ratear('desconto', 'vDesc')}>
    Ratear desconto
  </button>
  <button type="button" on:click={ratear('adicionais', 'vOutro')}>
    Ratear adicionais
  </button>
  <br />
{/if}
<br />

<Total bind:raiz />
<Transp bind:raiz />
<Pag bind:raiz total={raiz.total?.ICMSTot?.vNF ?? 0} />
<InfAdic bind:raiz />
<Local bind:raiz name="retirada" />
<Local bind:raiz name="entrega" />
<AutXml bind:raiz />
