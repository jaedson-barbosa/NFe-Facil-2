<script lang="ts">
  import { goto, url } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { Dados } from '../app/dados'
  import { edicao, dbColumns } from '../app/store'
  import { preparateJSON, generateXML } from '../nfe/finalizacao'
  import NFe from '../data-views/NFe.svelte'
  import INFeRoot from '../nfe/INFeRoot';

  let loading = false

  const ed = get(edicao)
  let problemaNota = !ed
  let raiz: INFeRoot = ed ? { ...ed.dado } : {}
  const isNFCe = [Dados.NFCesSalvas, Dados.NFCesEmitidas].includes(ed?.tipo)

  async function salvar() {
    loading = true
    try {
      const notasCol = isNFCe ? $dbColumns.notasCSalvas : $dbColumns.notasSalvas
      if (raiz.Id) {
        const docRef = notasCol.doc(raiz.Id)
        const doc = await docRef.get()
        if (doc.exists) await docRef.delete()
      }
      const xml = generateXML(raiz)
      const dhEmi = new Date(raiz.ide.dhEmi)
      const newRegister = { infNFe: raiz, dhEmi, xml }
      await notasCol.doc(raiz.Id).set(newRegister)
      $edicao = {
        dado: newRegister,
        id: raiz.Id,
        tipo: isNFCe ? Dados.NFCesSalvas : Dados.NFesSalvas
      }
      $goto('./exibNFe')
    } catch (error) {
      console.error(error)
      alert(error.message)
      loading = false
    }
  }

  async function transmitir() {
    loading = true
    try {
      const infNFe = preparateJSON(raiz)
      // const resp = await transmitirNFe({
      //   idEmpresa: $idEmpresa,
      //   infNFe,
      //   oldId: scoped.Id,
      // })
      // implementar continuação, tem que implementar a transmissão de NFCe também
      loading = false
    } catch (error) {
      console.error(error)
      alert(error.message)
      loading = false
    }
  }
</script>

{#if loading}
  Carregando...
{:else}
  {#if problemaNota}
    <h3>Aviso</h3>
    <p>
      Não foi fornecida a esta página informações sobre se deveria ser criada
      uma NF-e ou uma NFC-e, por isso foi criada uma NF-e padrão, se isso for o
      desejado então podes clicar em "Fechar", caso contrário, volte para a tela
      principal clicando em "Voltar".
    </p>
    <a class="button" href={$url('./')}>Voltar</a>
    <button on:click={() => problemaNota = false}>Fechar</button>
    <hr />
  {/if}
  <NFe bind:raiz {isNFCe} />
  <hr />
  <a href={$url('./')}>Cancelar</a>
  <button on:click={salvar}>Salvar</button>
  <button on:click={transmitir}>Transmitir</button>
{/if}
