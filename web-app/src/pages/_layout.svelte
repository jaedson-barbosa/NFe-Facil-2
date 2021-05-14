<!-- routify:options bundle=true -->
<!-- A opção acima ativa o bundle pra todos os filhos deste layout -->
<script lang="ts">
  import { url } from '@sveltech/routify'
  import { auth, googleProvider } from './firebase';
  import { onDestroy } from 'svelte';

  let user: firebase.default.UserInfo;
  const unsubscribe = auth.onAuthStateChanged(u => user = u)
  onDestroy(() => unsubscribe())

  function login() {
    auth.signInWithPopup(googleProvider);
  }
</script>

{#if user}
  <h3>Logado como {user.displayName}</h3>
  <small>uid {user.uid}</small>
  <button on:click={ () => auth.signOut() } class="button">Logout</button>
  <nav>
    <a href={$url('/')} title="Home">Home</a>
    <a href={$url('./about')} title="About">About</a>
  </nav>
  <slot scoped={{user}} />
{:else}
  <button on:click={login} class="button">
    Signin with Google
  </button>
{/if}
