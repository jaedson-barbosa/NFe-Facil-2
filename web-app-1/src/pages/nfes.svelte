<script lang="ts">
  import { XML, XMLC } from '../code/nfe/exibicao'
  import { Dados, edicao } from '../code/store'
  import { goto } from '@roxi/routify'
  import { DocumentSnapshot } from '@firebase/firestore'

  let emitidas = [] as DocumentSnapshot[]
  let naoEmitidas = [] as DocumentSnapshot[]
  const caixasEmitidas: HTMLDialogElement[] = []
  const caixasNaoEmitidas: HTMLDialogElement[] = []

  function criarNFe(dado = {} as any) {
    const id = dado.Id
    $edicao = { dado, id, tipo: Dados.NFes }
    $goto('./nfe')
  }

  async function DANFE(nfe: DocumentSnapshot) {
    const idEmpresa = nfe.get('emit.CNPJ')
    const idNota = nfe.get('Id')
    // const resp = await gerarDANFENFe({
    //   idEmpresa,
    //   emitida,
    //   idNota,
    // })
    // if (resp) {
    //   const byteCharacters = atob(resp)
    //   const blob = new Blob(
    //     [
    //       new Uint8Array(
    //         [...new Array(byteCharacters.length)].map((v, i) =>
    //           byteCharacters.charCodeAt(i)
    //         )
    //       ),
    //     ],
    //     { type: 'application/pdf' }
    //   )
    //   const url = window.URL.createObjectURL(blob)
    //   window.open(url)
    // }
  }

  async function cancelar(nfe: DocumentSnapshot) {}
</script>

<h1>Notas fiscais</h1>
<button on:click={() => criarNFe()}>Criar NF-e</button>

{#if emitidas.length}
  <h2>Emitidas</h2>
  <table>
    <thead>
      <tr>
        <th>Número</th>
        <th>Data e hora</th>
        <th>Destinatário</th>
      </tr>
    </thead>
    <tbody>
      {#each emitidas as n, i}
        <tr
          class="clicavel"
          class:homologacao={n.get('infNFe.ide.tpAmb') == '1'}
          class:cancelado={n.get('cancelada')}
          on:click={caixasEmitidas[i].showModal}
        >
          <td>{n.get('infNFe.ide.nNF')}</td>
          <td>{n.get('dhEmi').toDate().toLocaleString()}</td>
          <td>{n.get('infNFe.dest.xNome')}</td>
        </tr>
        <dialog bind:this={caixasEmitidas[i]}>
          <button on:click={() => criarNFe(n.get('infNFe'))}>Clonar</button>
          <button on:click={() => DANFE(n)}>DANFE</button>
          <button on:click={() => XML(n)}>XML</button>
          {#if n.get('cancelada')}
            <button on:click={() => XMLC(n)}>XML de cancelamento</button>
          {:else}
            <button on:click={() => cancelar(n)}>Cancelar</button>
          {/if}
        </dialog>
      {/each}
    </tbody>
  </table>
{/if}

{#if naoEmitidas.length}
  <h2>Não emitidas</h2>
  <table>
    <thead>
      <tr>
        <th>Data e hora</th>
        <th>Destinatário</th>
      </tr>
    </thead>
    <tbody>
      {#each naoEmitidas as n, i}
        <tr class="clicavel" on:click={caixasNaoEmitidas[i].showModal}>
          <td>{n.get('dhEmi').toDate().toLocaleString()}</td>
          <td>{n.get('infNFe.dest.xNome')}</td>
        </tr>
        <dialog bind:this={caixasNaoEmitidas[i]}>
          <button on:click={() => criarNFe(n.get('infNFe'))}>Editar</button>
          <button on:click={() => DANFE(n)}>DANFE</button>
          <button on:click={() => XML(n)}>XML</button>
        </dialog>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  .homologacao {
    background-color: #8888e1;
  }

  .cancelado {
    background-color: #e18888;
  }

  .cancelado.homologacao {
    background-color: #e188e1;
  }
</style>
