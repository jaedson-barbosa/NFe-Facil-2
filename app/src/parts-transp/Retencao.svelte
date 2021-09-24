<script lang="ts">
  import InputT from '../components/InputT.svelte'
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
  <InputT
    bind:val={retTransp['vServ']}
    lab="Valor do Serviço"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTransp['vBCRet']}
    lab="BC da Retenção do ICMS"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTransp['pICMSRet']}
    lab="Alíquota da Retenção"
    pat={'0|0.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(.[0-9]{2,4})?'}
  />
  <InputT
    bind:val={retTransp['vICMSRet']}
    lab="Valor do ICMS Retido"
    pat={'0|0.[0-9]{2}|[1-9]{1}[0-9]{0,12}(.[0-9]{2})?'}
  />
  <InputT
    bind:val={retTransp['CFOP']}
    lab="CFOP de serviço de transporte"
    pat={'[1,2,3,5,6,7]{1}[0-9]{3}'}
  />
  <Municipio
    bind:cMun={retTransp['cMunFG']}
    lab="Município do fato gerador do ICMS do transporte"
  />
{/if}
<br />
