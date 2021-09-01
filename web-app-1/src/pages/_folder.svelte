<script lang="ts">
  import { user, idEmpresa } from '../code/store'
  import Cadastro from '../folder-parts/Cadastro.svelte'
  import Escolha from '../folder-parts/Escolha.svelte'
</script>

<main class="container">
  {#if $user}
    {#if idEmpresa}
      <slot />
    {:else}
      <Escolha />
      <Cadastro />
    {/if}
  {:else if $user === null}
    <h1>Bem vindo ao NFe Fácil</h1>
    <button on:click={user.signIn}>Iniciar sessão</button>
  {:else}
    Aguardando serviço de autenticação...
  {/if}
</main>

<style>
  main {
    margin-top: 1.5rem;
  }

  button {
    text-align: center;
  }
</style>
