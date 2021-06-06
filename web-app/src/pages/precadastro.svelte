<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { createId } from '@form/helpers'
  import InputT from '@form/InputT.svelte'
  import { user } from '@app/store'
  import { requisitar } from '@app/functions'
  import { get } from 'svelte/store'

  let loading = false
  let files: FileList

  const requisicao = {
    cert: '',
    ident: get(user).displayName,
    senha: '',
  }

  async function precadastrar() {
    loading = true
    const certArray = new Uint8Array(await files[0].arrayBuffer())
    requisicao.cert = btoa(String.fromCharCode(...certArray))
    const idToken = await $user.getIdToken()
    const resp = await requisitar('precadastro', requisicao, idToken)
    if (resp.status == 201) {
      $goto('./')
    } else {
      alert(resp.status == 401 ? 'Erro na autenticação.' : await resp.text())
      loading = false
    }
  }

  const id = createId()
</script>

<form class="container content box" on:submit|preventDefault={precadastrar}>
  <fieldset disabled={loading}>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label" for={id}> Certificado </label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control is-expanded">
            <div class="file has-name is-fullwidth">
              <label class="file-label">
                <input
                  {id}
                  class="file-input"
                  type="file"
                  bind:files
                  required
                />
                <span class="file-cta">
                  <span class="file-icon">
                    <i class="fas fa-upload" />
                  </span>
                  <span class="file-label"> Selecionar arquivo </span>
                </span>
                <span class="file-name">
                  {#if files?.length}
                    {files[0].name}
                  {/if}
                </span>
              </label>
            </div>
          </div>
          <p class="help">O certificado será validado com uma requisição de testes à SEFAZ.</p>
        </div>
      </div>
    </div>
    <InputT
      label="Senha do certificado"
      aux="Necessária para assinatura e comunicação com a SEFAZ."
      bind:value={requisicao.senha}
    />
    <InputT
      label="Identificação"
      aux="Sua identificação no registro de usuários da empresa, por exemplo, seu nome."
      bind:value={requisicao.ident}
    />
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <button
          class="button is-primary"
          class:is-loading={loading}
          disabled={!files?.length}
        >
          Salvar
        </button>
      </p>
      <p class="control">
        <a href={$url('./')} class="button is-danger"> Cancelar </a>
      </p>
    </div>
  </fieldset>
</form>
