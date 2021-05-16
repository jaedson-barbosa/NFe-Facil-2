<script>
  import AutoForm from './_components/AutoForm.svelte'
  import { elementosNFe } from './_components/dataHelper'

  const root = {}
</script>

{@debug root}
<AutoForm el={elementosNFe[1]} {root} />
