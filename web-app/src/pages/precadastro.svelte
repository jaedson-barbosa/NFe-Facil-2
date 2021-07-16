<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { createId } from '@form/helpers'
  import InputT from '@form/InputT.svelte'
  import { user } from '@app/store'
  import { precadastro } from '@app/functions'
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
    const resp = await precadastro(requisicao)
    if (resp) {
      $goto('./')
    } else loading = false
  }

  const id = createId()
</script>

<form class="container" on:submit|preventDefault={precadastrar}>
  <fieldset disabled={loading}>
    <label class="button" for={id}> Certificado </label>
    <input {id} type="file" bind:files accept="application/x-pkcs12" required />
    {#if files?.length}
      <small>{files[0].name}</small>
    {:else}
      <small>
        O certificado será validado com uma requisição de teste à SEFAZ.
      </small>
    {/if}
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
    <input type="submit" class="button" />
  </fieldset>
</form>
