<script lang="ts">
  import InputT from '../components/InputT.svelte'
  import Opcional from '../components/Opcional.svelte'

  export let raiz: any

  $: infAdic = raiz['infAdic']
</script>

<Opcional {raiz} name="infAdic" titulo="informações adicionais">
  <h2>Informações adicionais</h2>
  <InputT
    bind:val={infAdic['infAdFisco']}
    opt
    lab="Informações adicionais de interesse do Fisco"
    min={1}
    max={2000}
  />
  <InputT
    bind:val={infAdic['infCpl']}
    opt
    lab="Informações complementares de interesse do Contribuinte"
    min={1}
    max={5000}
  />
</Opcional>
