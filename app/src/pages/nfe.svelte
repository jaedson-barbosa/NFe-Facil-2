<script lang="ts">
  import { goto, url } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao, refEmpresa, empresa } from '../code/store'
  import { preparateJSON, generateXML } from '../code/nfe/finalizacao'
  import NFe from '../nfe-parts/NFe.svelte'
  import {
    collection,
    doc,
    getDoc,
    deleteDoc,
    setDoc,
  } from '@firebase/firestore'
  import { transmitirNFe } from '../code/firebase'
  import { Dados } from '../code/tipos'
  import type { INFeRoot } from '../code/tipos'

  let loading = false

  const ed = get(edicao)
  let raiz: INFeRoot = {} as any
  if (ed?.tipo == Dados.NFes) raiz = ed.dado
  else $edicao = { tipo: Dados.NFes, dado: raiz, id: '' }
  raiz.emit = get(empresa).emit

  async function salvar() {
    loading = true
    try {
      raiz.ide.nNF = '0'
      const coluna = collection($refEmpresa, Dados.NFes)
      if (raiz.Id) {
        const docRef = doc(coluna, raiz.Id)
        const docObj = await getDoc(docRef)
        if (docObj.exists) await deleteDoc(docRef)
      }
      const xml = generateXML(raiz)
      const dhEmi = new Date(raiz.ide.dhEmi)
      const dado = { infNFe: raiz, dhEmi, xml }
      const docRef = doc(coluna, raiz.Id)
      await setDoc(docRef, dado)
      $edicao = { dado, id: raiz.Id, tipo: Dados.NFes }
      $goto(Dados.NFes)
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
      const dadosTransmissao = { infNFe, oldId }
      const respTransmissao = await transmitirNFe(dadosTransmissao)
      const dado = respTransmissao.data
      const tipo = Dados.NFes
      $edicao = { dado, id: dado.infNFe.Id, tipo }
      $goto(tipo)
      loading = false
    } catch (error) {
      console.error(error)
      alert(error.message)
      loading = false
    }
  }

  $: isProd = raiz['ide']?.['tpAmb'] == '1'
</script>

{#if loading}
  Carregando...
{:else}
  <NFe bind:raiz />
  <hr />
  {#if isProd}
    <button on:click={salvar}>Salvar</button>
  {/if}
  <button on:click={transmitir}>Transmitir</button>
{/if}
