<script lang="ts">
  import { user } from '../../store'
  import { url } from '@sveltech/routify'

</script>

{#if $user}
  <button on:click={user.signOut} class="button">Logout</button>
  <nav>
    <a href={$url('./cadastrar')}>Cadastrar</a>
    <a href={$url('./requisitar')}>Requisitar acesso</a>
    <a href={$url('./acessar')}>Acessar com certificado</a>
  </nav>
  <slot />
{:else}
  <button on:click={user.signIn} class="button">Signin with Google</button>
{/if}