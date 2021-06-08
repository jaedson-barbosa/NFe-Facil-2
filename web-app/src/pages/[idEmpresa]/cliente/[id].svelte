<script lang="ts">
  import { params, url, goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import { dest } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'

  export let id: string
  $: idEmpresa = $params['idEmpresa']

  let loading = false

  async function carregar() {
    const cliente = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('clientes')
      .doc(id)
      .get()
    if (!cliente.exists) throw new Error('Id não reconhecido.')
    return cliente.data()
  }

  async function salvar(root: any) {
    loading = true
    try {
      const dest = root.dest
      const _id = dest.CPF
        ? dest.CPF
        : dest.CNPJ
        ? dest.CNPJ
        : dest.idEstrangeiro
      if (_id != id) {
        alert('Não é permitido alterar o documento de um cliente cadastrado.')
        return
      }
      await db
        .collection('empresas')
        .doc(idEmpresa)
        .collection('clientes')
        .doc(id)
        .set(root)
      $goto('../')
    } catch (error) {
      alert(error.message)
      loading = false
    }
  }
</script>

{#await carregar()}
  Carregando...
{:then root}
  <form on:submit|preventDefault={() => salvar(root)}>
    <fieldset disabled={loading}>
      <AutoForm el={dest} {root}>
        <div class="field is-grouped is-grouped-centered">
          <p class="control">
            <button class="button is-primary" class:is-loading={loading}>
              Salvar
            </button>
          </p>
          <p class="control">
            <button type="reset" class="button is-warning"> Limpar </button>
          </p>
          <p class="control">
            <a href={$url('../')} class="button is-danger"> Cancelar </a>
          </p>
        </div>
      </AutoForm>
    </fieldset>
  </form>
{/await}
