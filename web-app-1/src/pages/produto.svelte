<script lang="ts">
  import { goto } from '@roxi/routify'
  import { get } from 'svelte/store'
  import { Dados } from '../app/dados'
  import { edicao, dbColumns, empresa } from '../app/store'
  import Det from '../nfe-parts/Det.svelte'

  let loading = false
  let raiz = undefined
  let regimeNormal = get(empresa).emit.CRT == '3'

  const ed = get(edicao)
  if (ed) {
    if (ed.tipo != Dados.Produtos) $edicao = undefined
    else raiz = { ...ed.dado }
  } else raiz = {}

  async function salvar() {
    loading = true
    try {
      const det = raiz.det
      const id = det.prod.cProd
      const prodRef = $dbColumns.produtos.doc(id)
      if (ed) {
        if (ed.id != id) {
          alert('Não é permitido alterar o código.')
          loading = false
          return
        }
      } else {
        const doc = await prodRef.get()
        const msg =
          'Já existe um produto cadastrado com este código. ' +
          'Deseja substituí-lo?'
        if (doc.exists && !confirm(msg)) {
          loading = false
          return
        }
      }
      await prodRef.set(raiz)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

<form on:submit|preventDefault={() => salvar()}>
  <fieldset disabled={loading}>
    <Det bind:raiz {regimeNormal} />
    <input type="submit" class="button" />
  </fieldset>
</form>
