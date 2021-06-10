<script lang="ts">
  import { dbColumns } from '@app/store'
  import { url, goto } from '@roxi/routify'
  import { user } from '@app/store'
  import InputT from '@form/InputT.svelte'

  let loading = false
  let cnpj: string
  let ident = $user.displayName

  async function requisitar() {
    loading = true
    try {
      await $dbColumns.usuarios.doc($user.uid).set({
        id: $user.uid,
        status: 0,
        ident,
      })
      $goto('./')
    } catch (error) {
      console.error(error)
      alert('Erro no registro do pedido.')
      loading = false
    }
  }
</script>

<form class="container content box" on:submit|preventDefault={requisitar}>
  <fieldset disabled={loading}>
    <InputT
      label="CNPJ"
      aux="CNPJ da empresa já cadastrada."
      mask="cnpj"
      minlength={14}
      maxlength={14}
      bind:value={cnpj}
    />
    <InputT
      label="Identificação"
      aux="Sua identificação no registro de usuários da empresa, por exemplo, seu nome."
      minlength={2}
      maxlength={60}
      bind:value={ident}
    />
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <button class="button is-primary" class:is-loading={loading}>
          Requisitar
        </button>
      </p>
      <p class="control">
        <a href={$url('./')} class="button is-danger"> Cancelar </a>
      </p>
    </div>
  </fieldset>
</form>
