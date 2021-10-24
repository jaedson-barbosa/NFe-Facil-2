<script lang="ts">
  import { get } from 'svelte/store'
  import { Dados } from '../code/tipos'
  import { carregando, edicao, empresa, refEmpresa } from '../code/store'
  import Voltar from '../components/Voltar.svelte'
  import Imposto from '../parts-imposto/Imposto.svelte'
  import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
    where,
    writeBatch,
  } from '@firebase/firestore'
  import { goto } from '@roxi/routify'
  import { calcularIdImposto } from '../code/imposto/registro'
  import { query, setDoc } from 'firebase/firestore'
  import { db } from '../code/firebase'
import Ajuda from '../components/Ajuda.svelte';

  const empresaCarregada = get(empresa)
  const regimeNormal = ['2', '3'].includes(empresaCarregada.emit.CRT)

  const ed = get(edicao)
  let raiz = ed?.tipo === Dados.Impostos ? ed.dado : {}

  async function salvar() {
    $carregando = true
    const colecao = collection(refEmpresa, Dados.Impostos)
    const id = await calcularIdImposto(raiz.imposto)
    const ref = doc(colecao, id)
    if (ed && ed.id === id) {
      await updateDoc(ref, raiz)
    } else {
      if (ed) {
        const oldRef = doc(colecao, ed.id)
        await deleteDoc(oldRef)
        const oldProds = await getDocs(
          query(
            collection(refEmpresa, Dados.Produtos),
            where('perfilTributario', '==', ed.id)
          )
        )
        if (!oldProds.empty) {
          // Atualizamos a referencia a todos os produtos
          await oldProds.docs.reduce((p,v) =>
            p.update(v.ref, 'perfilTributario', id)
          , writeBatch(db)).commit()
        }
      }
      await setDoc(ref, raiz)
    }
    $goto('./')
    $carregando = false
  }
</script>

{#if !$carregando}
  <form on:submit|preventDefault={salvar}>
    <h1><Voltar /> Perfil tributário</h1>
    <label>
      Descrição
      <input
        bind:value={raiz.descricao}
        minlength="2"
        maxlength="32"
        required
      />
    </label>
    <hr />
    <Imposto bind:imposto={raiz.imposto} {regimeNormal} />
    <input type="submit" class="button" value="Salvar" />
  </form>
  <Ajuda>
    <p>
      1. Este ICMS interestadual deve ser preenchido apenas nas vendas
      interestaduais para consumidor final não contribuinte do ICMS (exceto em
      vendas de veículos novos e demais exceções detalhadas na página 115 do Anexo
      I do MOC).
    </p>
  </Ajuda>
{/if}
