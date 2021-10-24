<script lang="ts">
  import { get } from 'svelte/store'
  import { Dados } from '../code/tipos'
  import { carregando, edicao, empresa, refEmpresa } from '../code/store'
  import Voltar from '../components/Voltar.svelte'
  import Imposto from '../parts-imposto/Imposto.svelte'
  import { addDoc, collection, doc, updateDoc } from '@firebase/firestore'
  import { goto } from '@roxi/routify'

  const empresaCarregada = get(empresa)
  const regimeNormal = ['2', '3'].includes(empresaCarregada.emit.CRT)

  const ed = get(edicao)
  let raiz = ed?.tipo === Dados.Impostos ? ed.dado : {}

  async function salvar() {
    $carregando = true
    const colecao = collection(refEmpresa, Dados.Impostos)
    if (ed) await updateDoc(doc(colecao, ed.id), raiz)
    else await addDoc(colecao, raiz)
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
{/if}
