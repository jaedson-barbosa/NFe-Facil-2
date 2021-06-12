<script lang="ts">
  import { generateNFCe } from './rootGenerator'
  import { goto } from '@roxi/routify'
  import { empresa } from '@app/store'
  import type INFeRoot from './INFeRoot';

  export let scoped: any

  const result = generateNFCe($empresa)
  scoped.updateScoped(result)
  $goto('./identificacao')
</script>

<progress class="progress is-large" />
