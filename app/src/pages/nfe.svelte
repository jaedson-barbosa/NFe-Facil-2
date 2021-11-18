<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { carregando, edicao, refEmpresa, empresa } from '../code/store'
  import { preparateJSON, generateXML } from '../code/nfe/finalizacao'
  import {
    collection,
    doc,
    getDoc,
    deleteDoc,
    setDoc,
  } from '@firebase/firestore'
  import { transmitirNFCe, transmitirNFe } from '../code/firebase'
  import { Dados } from '../code/tipos'
  import type { INFeRoot } from '../code/tipos'
  import AutXml from '../parts-nfe/AutXML.svelte'
  import Compra from '../parts-nfe/Compra.svelte'
  import Destinatario from '../parts-nfe/Destinatario.svelte'
  import Exporta from '../parts-nfe/Exporta.svelte'
  import Ide from '../parts-nfe/Ide.svelte'
  import InfAdic from '../parts-nfe/InfAdic.svelte'
  import Local from '../parts-nfe/Local.svelte'
  import Pag from '../parts-nfe/Pag.svelte'
  import Produtos from '../parts-nfe/Produtos.svelte'
  import Transp from '../parts-nfe/Transp.svelte'
  import Voltar from '../components/Voltar.svelte'
  import { toNFeString } from '../code/getDataString'
  import Cobranca from '../parts-nfe/Cobranca.svelte'
  import Cana from '../parts-nfe/Cana.svelte'

  const ed = get(edicao)
  let raiz: INFeRoot = {} as any
  if (ed?.tipo == Dados.NFes) raiz = ed.dado.infNFe ?? ed.dado
  else $edicao = { tipo: Dados.NFes, dado: raiz, id: '' }
  raiz.emit = get(empresa).emit

  raiz.infRespTec = {
    CNPJ: '12931158000164',
    xContato: 'Jaedson Barbosa Serafim',
    email: 'jaedson33@gmail.com',
    fone: '83988856440',
  }

  async function salvar() {
    $carregando = true
    try {
      raiz.ide.nNF = '0'
      const coluna = collection(refEmpresa, Dados.NFes)
      if (raiz.Id) {
        const docRef = doc(coluna, raiz.Id)
        const docObj = await getDoc(docRef)
        if (docObj.exists) await deleteDoc(docRef)
      }
      const infNFe: any = preparateJSON(raiz)
      raiz.ide.nNF = '1'
      const xml = generateXML(raiz)
      const dhEmi = new Date(infNFe.ide.dhEmi)
      const dado = { infNFe, dhEmi, xml }
      const docRef = doc(coluna, infNFe.Id)
      await setDoc(docRef, dado)
      $edicao = { dado, id: infNFe.Id, tipo: Dados.NFes }
      $goto('./nfeExib')
      $carregando = false
    } catch (error) {
      console.error(error)
      alert(error.message)
      $carregando = false
    }
  }

  async function transmitir() {
    $carregando = true
    try {
      raiz.ide['dhEmi'] = toNFeString(new Date())
      const oldId = raiz.Id
      const infNFe = preparateJSON(raiz, true)
      const dadosTransmissao = { infNFe, oldId }
      const respTransmissao = isNFCe
        ? await transmitirNFCe(dadosTransmissao)
        : await transmitirNFe(dadosTransmissao)
      const data = respTransmissao.data
      if (data.mensagem) alert('Mensagem da SEFAZ para você:\n' + data.mensagem)
      $edicao = { dado: data, id: data.infNFe.Id, tipo: Dados.NFes }
      $goto('./nfeExib')
      $carregando = false
    } catch (error) {
      console.error(error)
      alert(error.message)
      $carregando = false
    }
  }

  $: consumidorFinal = raiz.ide?.indFinal == '1'
  $: isNFCe = raiz.ide?.['mod'] === '65'
</script>

{#if !$carregando}
  <h1><Voltar /> Nota fiscal</h1>
  <Ide bind:raiz />
  <Destinatario bind:dest={raiz.dest} {isNFCe} />
  <Produtos
    bind:det={raiz.det}
    bind:total={raiz.total}
    {consumidorFinal}
    ufOrigem={raiz.emit.enderEmit.UF}
    ufDestino={raiz.dest?.enderDest?.UF}
  />
  <Transp bind:raiz />
  <Pag bind:raiz total={raiz.total?.ICMSTot?.vNF ?? 0} />
  <InfAdic bind:raiz {consumidorFinal} />
  <Local bind:raiz name="retirada" />
  <Local bind:raiz name="entrega" />
  {#if raiz.exporta}
    <Exporta bind:exporta={raiz.exporta} />
  {/if}
  {#if raiz.compra}
    <Compra bind:compra={raiz.compra} />
  {/if}
  {#if raiz.cobr}
    <Cobranca bind:cobr={raiz.cobr} />
  {/if}
  {#if raiz.cana}
    <Cana bind:cana={raiz.cana} />
  {/if}
  <AutXml bind:raiz />
  <hr />
  <button on:click={salvar}>Apenas salvar</button>
  <button on:click={transmitir}>Transmitir</button>
{/if}
