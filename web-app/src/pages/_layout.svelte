<script lang="ts">
  import { user } from '@app/store'
</script>

<main class="container">
  {#if $user}
    <slot />
  {:else}
    <h1>Bem vindo ao NFe Fácil</h1>
    <button on:click={user.signIn}> Iniciar sessão </button>
  {/if}
</main>

<style>
  main {
    margin-top: 1.5rem;
  }
</style>
