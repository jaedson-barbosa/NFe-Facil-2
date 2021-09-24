<script lang="ts">
  import InputT from '../components/InputT.svelte'

  export let raiz: any

  if (!raiz.infAdic) raiz.infAdic = {}
</script>

<h2>Informações adicionais</h2>
<InputT
  bind:val={raiz.infAdic['infAdFisco']}
  opt
  lab="Informações adicionais de interesse do Fisco"
  min={1}
  max={2000}
/>
<InputT
  bind:val={raiz.infAdic['infCpl']}
  opt
  lab="Informações complementares de interesse do Contribuinte"
  min={1}
  max={5000}
/>
<br />
