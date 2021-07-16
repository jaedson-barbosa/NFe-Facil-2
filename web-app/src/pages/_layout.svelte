<script lang="ts">
  import { user } from '@app/store'
</script>

{#if $user}
  <slot />
{:else}
  <main class="container">
    <h1>Bem vindo ao NFe Fácil</h1>
    <button on:click={user.signIn}> Iniciar sessão </button>
  </main>
{/if}

<style>
  h1 {
    color: purple;
  }
  main {
    margin: 20px;
  }
</style>
