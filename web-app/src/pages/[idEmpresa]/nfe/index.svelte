<script lang="ts">
  import { generate } from './rootGenerator'
  import { goto } from '@roxi/routify'
  import { empresa } from '@app/store'
  import type INFeRoot from './INFeRoot';

  export let scoped: { commom: { root: INFeRoot } }

  const initialValue = generate($empresa)
  scoped.commom.root = initialValue
  $goto('./identificacao')
</script>

<progress class="progress is-large" />
