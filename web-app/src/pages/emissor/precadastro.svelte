<script lang="ts">
  import { url, goto } from '@sveltech/routify'
  import { createId } from '@form/formElements/helpers'
  import Input from '@form/formElements/Input.svelte'
  import { user } from '@app/store'

  let loading = false
  let files: FileList
  
  const requisicao = {
    cert: '',
    ident: $user.displayName,
    senha: ''
  }

  const infoSenha = {
    name: 'senha',
    annotation: {
      label: 'Senha do certificado',
      aux: 'Necessária para assinatura e comunicação com a SEFAZ.',
    },
    restriction: {}
  }

  const infoNome = {
    name: 'ident',
    annotation: {
      label: 'Identificação',
      aux: 'Sua identificação no registro de usuários da empresa, por exemplo, seu nome.',
    },
    restriction: {}
  }

  async function precadastrar() {
    loading = true
    const certArray = new Uint8Array(await files[0].arrayBuffer())
    requisicao.cert = btoa(String.fromCharCode(...certArray))
    const idToken = await $user.getIdToken()
    const resp = await fetch(
      'http://localhost:5001/nfe-facil-980bc/us-central1/precadastro',
      {
        method: 'POST',
        body: JSON.stringify(requisicao),
        headers: { Authorization: 'Bearer ' + idToken },
      }
    )
    if (resp.status == 201) {
      $goto('../')
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
                <input {id} class="file-input" type="file" bind:files required />
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
        </div>
      </div>
    </div>
    <Input root={requisicao} el={infoSenha} />
    <Input root={requisicao} el={infoNome} />
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
        <button type="reset" class="button is-warning"> Limpar </button>
      </p>
      <p class="control">
        <a href={$url('../')} class="button is-danger"> Cancelar </a>
      </p>
    </div>
  </fieldset>
</form>
