<script lang="ts">
  import InputT from '../components/InputT.svelte'

  export let raiz: any
</script>

<InputT
  bind:val={raiz['nRECOPI']}
  lab="Número do RECOPI"
  pat={'[0-9]{20}'}
  max={20}
  opt
/>
