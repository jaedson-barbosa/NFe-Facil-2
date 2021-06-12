<script lang="ts">
  import type { IScoped } from './IScoped'
  import type INFeRoot from '../INFeRoot'

  export let scoped: { updateScoped: (root: INFeRoot) => void }
  export let id: string

  let innerScoped: IScoped = { ...scoped, id }
</script>

<slot scoped={innerScoped} />
