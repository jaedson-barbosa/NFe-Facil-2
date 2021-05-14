<!-- routify:options bundle=true -->
<script lang="ts">
  import { layout, url } from '@sveltech/routify'
  import { user } from '../store'
</script>

{#if $user}
  <h3>Logado como {$user.displayName}</h3>
  <small>uid {$user.uid}</small>
  <button on:click={user.signOut} class="button">Logout</button>
  <nav>
    {#each $layout.children as node}
      <a href={$url(node.path)}>{node.title}</a>
    {/each}
  </nav>
  <slot />
{:else}
  <button on:click={user.signIn} class="button">Signin with Google</button>
{/if}
