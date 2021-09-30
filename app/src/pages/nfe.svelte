<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { edicao, refEmpresa, empresa } from '../code/store'
  import { preparateJSON, generateXML } from '../code/nfe/finalizacao'
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
  import AutXml from '../parts-nfe/AutXML.svelte'
  import Destinatario from '../parts-nfe/Destinatario.svelte'
  import Ide from '../parts-nfe/Ide.svelte'
  import InfAdic from '../parts-nfe/InfAdic.svelte'
  import Local from '../parts-nfe/Local.svelte'
  import Pag from '../parts-nfe/Pag.svelte'
  import Produtos from '../parts-nfe/Produtos.svelte'
  import Transp from '../parts-nfe/Transp.svelte'
  import Voltar from '../components/Voltar.svelte'

  let loading = false

  const ed = get(edicao)
  let raiz: INFeRoot = {} as any
  if (ed?.tipo == Dados.NFes) raiz = ed.dado
  else $edicao = { tipo: Dados.NFes, dado: raiz, id: '' }
  raiz.emit = get(empresa).emit

  raiz.infRespTec = {
    CNPJ: '12931158000164',
    xContato: 'Jaedson Barbosa Serafim',
    email: 'jaedson33@gmail.com',
    fone: '83988856440',
  }

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
</script>

{#if loading}
  Carregando...
{:else}
  <h1><Voltar /> Nota fiscal</h1>
  <Ide bind:raiz />
  <Destinatario bind:dest={raiz.dest} isNFCe={raiz.ide?.['mod'] === '65'} />
  <Produtos
    bind:det={raiz.det}
    bind:total={raiz.total}
    consumidorFinal={raiz.ide?.indFinal == '1'}
  />
  <Transp bind:raiz />
  <Pag bind:raiz total={raiz.total?.ICMSTot?.vNF ?? 0} />
  <InfAdic bind:raiz />
  <Local bind:raiz name="retirada" />
  <Local bind:raiz name="entrega" />
  <AutXml bind:raiz />
  <hr />
  <button on:click={salvar}>Apenas salvar</button>
  <button on:click={transmitir}>Salvar e transmitir</button>
{/if}
