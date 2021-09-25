<script lang="ts">
  import Municipio from '../components/Municipio.svelte'

  export let retTransp: any

  let informar = !!retTransp
  $: retTransp = informar ? {} : undefined
</script>

<label>
  <input type="checkbox" bind:checked={informar} />
  Informar dados de Retenção do ICMS no Transporte
</label>
{#if retTransp}
  <label>
    Valor do Serviço
    <input type="number" step="0.01" bind:value={retTransp['vServ']} required />
  </label>
  <label>
    BC da Retenção do ICMS
    <input type="number" step="0.01" bind:value={retTransp['vBCRet']} required />
  </label>
  <label>
    Alíquota da Retenção
    <input type="number" step="0.0001" bind:value={retTransp['pICMSRet']} required />
  </label>
  <label>
    Valor do ICMS Retido
    <input type="number" step="0.01" bind:value={retTransp['vICMSRet']} required />
  </label>
  <label>
    CFOP de serviço de transporte
    <input type="number" step="1" bind:value={retTransp['CFOP']} required />
  </label>
  <Municipio
    bind:cMun={retTransp['cMunFG']}
    lab="Município do fato gerador do ICMS do transporte"
  />
{/if}
<br />
