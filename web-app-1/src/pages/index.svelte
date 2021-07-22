<script lang="ts">
  import { cancelarNFe, gerarDANFENFe as danfeNFe } from "../app/funcNFe";
  import { userStatus, dbColumns, edicao, idEmpresa } from "../app/store";
  import { applyMask } from "../app/documentUtils";
  import type { TDocument } from "../app/store";
  import { goto, url } from "@roxi/routify";
  import { Dados } from "../app/dados";
  import { debounce } from "lodash-es";

  type TCadastro = firebase.firestore.QueryDocumentSnapshot<TDocument>;

  $edicao = undefined;

  function getColuna() {
    switch (dadosAtual) {
      case Dados.Clientes:
        return $dbColumns.clientes;
      case Dados.Produtos:
        return $dbColumns.produtos;
      case Dados.Transportes:
        return $dbColumns.transportes;
      case Dados.NFesSalvas:
        return $dbColumns.notasSalvas;
      case Dados.NFesEmitidas:
        return $dbColumns.notasEmitidas;
      case Dados.NFCesSalvas:
        return $dbColumns.notasCSalvas;
      case Dados.NFCesEmitidas:
        return $dbColumns.notasCEmitidas;
    }
  }

  function getRotulo(atual: Dados) {
    switch (atual) {
      case Dados.Clientes:
        return "Nome do cliente";
      case Dados.Produtos:
        return "Descrição do produto";
      case Dados.Transportes:
        return "Nome do transportador";
      default:
        return "Número";
    }
  }

  function getAddUrl(atual: Dados) {
    switch (atual) {
      case Dados.Clientes:
        return "./cliente";
      case Dados.Produtos:
        return "./produto";
      case Dados.Transportes:
        return "./transporte";
      default:
        return "./nfe";
    }
  }

  function getCampoBusca(atual: Dados) {
    switch (atual) {
      case Dados.Clientes:
        return "dest.xNome";
      case Dados.Produtos:
        return "det.prod.xProd";
      case Dados.Transportes:
        return "transporta.xNome";
      default:
        return "infNFe.ide.nNF";
    }
  }

  function getCabecalhos(atual: Dados) {
    switch (atual) {
      case Dados.Clientes:
        return ["Documento", "Nome"];
      case Dados.Produtos:
        return ["Código", "Descrição"];
      case Dados.Transportes:
        return ["Documento", "Nome"];
      default:
        return ["Número", "Série", "Data e hora", "Cliente", "Status", "Ambiente"];
    }
  }

  function getDocDest(v: TCadastro) {
    const cpf = v.get("dest.CPF");
    if (cpf) return applyMask(cpf, "cpf");
    const cnpj = v.get("dest.CNPJ");
    if (cnpj) return applyMask(cnpj, "cnpj");
    const idEstrangeiro = v.get("dest.idEstrangeiro");
    return idEstrangeiro;
  }

  function getDocTransporta(v: TCadastro) {
    const cpf = v.get("transporta.CPF");
    if (cpf) return applyMask(cpf, "cpf");
    const cnpj = v.get("transporta.CNPJ");
    return applyMask(cnpj, "cnpj");
  }

  function getItemRender(busca: Dados): (v: TCadastro) => string[] {
    switch (busca) {
      case Dados.Clientes:
        return (v) => [getDocDest(v), v.get("dest.xNome")];
      case Dados.Produtos:
        return (v) => [v.get("det.prod.cProd"), v.get("det.prod.xProd")];
      case Dados.Transportes:
        return (v) => [getDocTransporta(v), v.get("transporta.xNome")];
      default:
        return (v) => {
          const cancelada = v.get("cancelada");
          return [
            v.get("infNFe.ide.nNF"),
            v.get("infNFe.ide.serie"),
            v.get("dhEmi").toDate().toLocaleString(),
            v.get("infNFe.dest.xNome") ?? "Não informado",
            cancelada ? "Cancelada" : cancelada === false ? "Emitida" : "Apenas salva",
            v.get("infNFe.ide.tpAmb") == "1" ? "Produção" : "Homologação",
          ];
        };
    }
  }

  function edit(cad: TCadastro, tipo: Dados) {
    $edicao = {
      dado: cad.data(),
      id: cad.id,
      tipo,
    };
    $goto(addUrl);
  }

  function reset(atual: Dados) {
    cadastros = [];
    lastBusca = "";
    hasMore = false;
    buscar();
  }

  let dadosAtual: Dados = Dados.Clientes;

  $: isDadoSimples =
    dadosAtual == Dados.Clientes || dadosAtual == Dados.Produtos || dadosAtual == Dados.Transportes;
  $: rotulo = getRotulo(dadosAtual);
  $: addUrl = getAddUrl(dadosAtual);
  $: campoBusca = getCampoBusca(dadosAtual);
  $: cabecalhos = getCabecalhos(dadosAtual);
  $: itemRender = getItemRender(dadosAtual);
  $: {
    reset(dadosAtual);
  }
  $: writePermission = $userStatus >= 3;

  let cadastros: TCadastro[] = [];
  let lastBusca = "";
  let hasMore = false;

  async function buscar(busca: string = lastBusca) {
    hasMore = false;
    let query = getColuna().limit(10).orderBy(campoBusca, "desc");
    if (busca != lastBusca) {
      cadastros = [];
      if (busca) {
        const next = (c: string) => String.fromCharCode(c.charCodeAt(0) + 1);
        const end = busca.replace(/.$/, next);
        query = query.where(campoBusca, ">=", busca).where(campoBusca, "<", end);
      }
    } else if (cadastros.length) {
      const last = cadastros[cadastros.length - 1];
      query = query.startAfter(last);
    }
    const docs = await query.get();
    hasMore = docs.size == 10;
    cadastros = [...cadastros, ...docs.docs];
    lastBusca = busca;
  }

  function getDownloadLink(xml: string) {
    const blob = new Blob([xml], { type: "application/xml" });
    return window.URL.createObjectURL(blob);
  }
</script>

<a class="button" href={$url("./emitente")}> Editar dados do emitente </a>

<label>
  Visualização
  <select bind:value={dadosAtual}>
    <option value={Dados.Clientes}>Clientes</option>
    <option value={Dados.Produtos}>Produtos</option>
    <option value={Dados.Transportes}>Transportes</option>
    <option value={Dados.NFesSalvas}>NF-es salvas</option>
    <option value={Dados.NFesEmitidas}>NF-es emitidas</option>
    <option value={Dados.NFCesSalvas}>NFC-es salvas</option>
    <option value={Dados.NFesEmitidas}>NFC-es emitidas</option>
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
        {#each itemRender(cad) as i, index}
          <td>{i}</td>
        {/each}
        <td>
          {#if isDadoSimples}
            <button on:click|once={() => edit(cad, dadosAtual)}> Editar </button>
          {:else if writePermission}
            <button on:click|once={() => edit(cad, dadosAtual)}>
              {#if dadosAtual == Dados.NFesSalvas || Dados.NFCesSalvas}
                Editar
              {:else}
                Clonar
              {/if}
            </button>
            <a class="button" href={getDownloadLink(cad.get("xml"))} download={cad.id}>
              Baixar XML
            </a>
            {#if cad.get("cancelada")}
              <a
                class="button"
                href={getDownloadLink(cad.get("xmlCancelamento"))}
                download={"cancel" + cad.id}>
                Baixar XML de cancelamento
              </a>
            {:else if cad.get("cancelada") === false}
              <button on:click|once={() => danfeNFe($idEmpresa, cad.id, true)}>
                Gerar DANFE
              </button>
              <button on:click|once={() => cancelarNFe($idEmpresa, cad.id)}> Cancelar </button>
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
          <button class="button" on:click={() => buscar()}> Carregar mais </button>
        </td>
      </tr>
    </tfoot>
  {/if}
</table>
