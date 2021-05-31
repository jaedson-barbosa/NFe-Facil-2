<!-- routify:options bundle=false -->
<script lang="ts">
  import { layout, url } from '@roxi/routify'
</script>

<nav>
  {#each $layout.children as node}
    <a href={$url(node.path)}>{node.title}</a>
  {/each}
</nav>
<slot />
