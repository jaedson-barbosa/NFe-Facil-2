<script lang="ts">
  import { user } from '@app/store'
</script>

{#if $user}
  <slot />
{:else}
  <button on:click={user.signIn} class="button">Iniciar sessão</button>
{/if}
