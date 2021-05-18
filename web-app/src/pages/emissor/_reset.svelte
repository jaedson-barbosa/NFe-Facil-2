<script lang="ts">
  import { user } from '@app/store'
  import { url } from '@sveltech/routify'
</script>

{#if $user}
  <button on:click={user.signOut} class="button">Encerar sessão</button>
  <nav>
    <a href={$url('./precadastro')}>Cadastrar</a>
    <a href={$url('./requisicao')}>Requisitar acesso</a>
    <a href={$url('./acesso')}>Acessar com certificado</a>
  </nav>
  <slot />
{:else}
  <button on:click={user.signIn} class="button">Iniciar sessão</button>
{/if}
