<script>
  import { url } from '@sveltech/routify'
</script>

<a href={$url('/')} title="Home">Home</a>
<a href={$url('./about')} title="About">About</a>
<slot />
