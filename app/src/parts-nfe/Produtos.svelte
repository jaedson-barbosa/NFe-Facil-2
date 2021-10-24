<script lang="ts">
  import Total from './parts-produto/Total.svelte'
  import ProdutoSimples from './parts-produto/ProdutoSimples.svelte'
  import { doc, DocumentSnapshot, getDoc } from 'firebase/firestore'
  import { perfisTributarios, refEmpresa } from '../code/store'
  import { Dados } from '../code/tipos'
  import { Buscador } from '../code/buscador'
  import { getMoeda } from '../code/numero'
  import { goto } from '@roxi/routify'

  export let det: any[]
  export let total: any
  export let consumidorFinal: boolean

  let carregado = false

  if (det?.length) {
    //verificar esse id de produto
    const cods: string[] = det.map((v) => v.prod.cProd)
    const refs = cods.map((v) => doc(refEmpresa, Dados.Produtos, v))
    Promise.all(refs.map((v) => getDoc(v))).then((v) => {
      v.forEach((k, i) => (det[i].ibpt = k.get('ibpt')))
      carregado = true
    })
  } else {
    det = []
    carregado = true
  }

  let produtos = [] as DocumentSnapshot[]
  const buscadorProduto = new Buscador(
    refEmpresa,
    Dados.Produtos,
    'prod.xProd',
    'asc',
    (v) => (produtos = v),
    true
  )

  function ratear(titulo: string, campo: string) {
    return () => {
      const valor = +prompt(`Valor total do ${titulo}:`)
      if (isNaN(valor)) return
      const total = det.reduce((p, c) => +c.prod.vProd + p, 0)
      det.forEach((v) => {
        const novo = (valor * v.prod.vProd) / total
        v.prod[campo] = +novo.toFixed(2)
      })
      det = det
    }
  }

  function addProd(p: DocumentSnapshot) {
    return () => {
      const { perfilTributario, prod, ibpt } = p.data()
      const { imposto } = $perfisTributarios.find(
        (v) => v.id === perfilTributario
      )
      det = [{ prod, imposto, ibpt, perfilTributario }, ...det]
    }
  }

  function removerProd(index: number) {
    return () => {
      det.splice(index, 1)
      det = det
    }
  }

  $: {
    det.forEach((v, i) => (v.nItem = i + 1))
  }
</script>

{#if carregado}
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
        <tr class="clicavel" on:click={addProd(p)}>
          <td>{p.get('prod.cProd')}</td>
          <td>{p.get('prod.xProd')}</td>
          <td>{getMoeda(p.get('prod.vUnCom'))}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if det.length}
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
        {#each det as _, i}
          <ProdutoSimples
            bind:raiz={det[i]}
            {consumidorFinal}
            on:invalido={removerProd(i)}
            on:click={() => $goto('/:produto', { produto: i.toString() })}
          />
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
    <br />
    <Total bind:det bind:total {consumidorFinal} />
  {/if}
  <br />
{/if}
