<script lang="ts">
  import { goto, url } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao, Dados, refEmpresa, idEmpresa } from '../code/store'
  import { preparateJSON, generateXML } from '../code/nfe/finalizacao'
  import NFe from '../nfe-parts/NFe.svelte'
  import {
    collection,
    doc,
    getDoc,
    deleteDoc,
    setDoc,
  } from '@firebase/firestore'
  import { transmitirNFe } from '../code/functions'

  let loading = false

  const ed = get(edicao)
  let problemaNota = !ed
  let raiz: INFeRoot = ed ? { ...ed.dado } : {}
  const isNFCe = ed?.tipo == Dados.NFCes

  async function salvar() {
    loading = true
    try {
      const notasCol = collection(
        $refEmpresa,
        isNFCe ? Dados.NFCes : Dados.NFes
      )
      if (raiz.Id) {
        const docRef = doc(notasCol, raiz.Id)
        const docObj = await getDoc(docRef)
        if (docObj.exists) await deleteDoc(docRef)
      }
      const xml = generateXML(raiz)
      const dhEmi = new Date(raiz.ide.dhEmi)
      const dado = { infNFe: raiz, dhEmi, xml }
      const docRef = doc(notasCol, raiz.Id)
      await setDoc(docRef, dado)
      const tipo = isNFCe ? Dados.NFCes : Dados.NFes
      $edicao = { dado: dado, id: raiz.Id, tipo }
      $goto(tipo)
    } catch (error) {
      console.error(error)
      alert(error.message)
      loading = false
    }
  }

  async function transmitir() {
    loading = true
    try {
      const oldId = raiz.Id
      const infNFe = preparateJSON(raiz)
      const dadosTransmissao = { idEmpresa: $idEmpresa, infNFe, oldId }
      const respTransmissao = await transmitirNFe(dadosTransmissao)
      // Implementar também a exibição da nota
      // implementar continuação, tem que implementar a transmissão de NFCe também
      loading = false
    } catch (error) {
      console.error(error)
      alert(error.message)
      loading = false
    }
  }

  $: isProd = raiz['ide']['tpAmb'] == '1'
</script>

{#if loading}
  Carregando...
{:else}
  {#if problemaNota}
    <h3>Aviso</h3>
    <p>
      Não foi fornecida a esta página informações sobre se deveria ser criada
      uma NF-e ou uma NFC-e, por isso foi criada uma NF-e padrão, se isso for o
      desejado então clique em "Fechar", caso contrário, clique em "Voltar".
    </p>
    <a class="button" href={$url('./')}>Voltar</a>
    <button on:click={() => (problemaNota = false)}>Fechar</button>
    <hr />
  {/if}
  <NFe bind:raiz {isNFCe} />
  <hr />
  <a href={$url('./')}>Cancelar</a>
  {#if isProd}
    <button on:click={salvar}>Salvar</button>
  {/if}
  <button on:click={transmitir}>Transmitir</button>
{/if}

// estudar união de notas numa única tabela, uma pra nfes e outra pra nfces,
onde aquelas apenas salvas teriam o numero 0, para a união rodar um script no
servidor que vai fazer a mudança, sorte que por enquanto só o Areal usa
