<script lang="ts">
  import { generateNFe } from './rootGenerator'
  import { goto } from '@roxi/routify'
  import { empresa } from '@app/store'
  import type INFeRoot from './INFeRoot';

  export let scoped: any

  const result = generateNFe($empresa)
  scoped.updateScoped(result)
  $goto('./identificacao')
</script>

<progress class="progress is-large" />
