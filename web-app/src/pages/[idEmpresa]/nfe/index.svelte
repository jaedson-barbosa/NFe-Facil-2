<script lang="ts">
  import { generate } from './rootGenerator'
  import { goto } from '@roxi/routify'
  import { empresa } from '@app/store'
  import type INFeRoot from './INFeRoot';

  export let scoped: INFeRoot

  generate($empresa, scoped)
  $goto('./identificacao')
</script>

<progress class="progress is-large" />
